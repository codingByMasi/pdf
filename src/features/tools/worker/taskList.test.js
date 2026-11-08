// Tests the real task list through the worker handler, handing over memory like a real worker does.
import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { createWorkerHandler } from '../../../shared/lib/workerCore.js';
import { loadPdf } from '../../../shared/lib/pdfLoad.js';
import { tinyJpg } from '../../../shared/lib/testImages.js';
import { tasks } from './taskList.js';

// Runs one task the way a worker does. structuredClone with "transfer" empties handed-over memory, like postMessage.
function runLikeWorker(task, payload, services = {}) {
  return new Promise((resolve, reject) => {
    let handle;
    const post = (message, transfer) => {
      const copy = structuredClone(message, { transfer });
      if (copy.type === 'done') resolve(copy.result);
      else if (copy.type === 'fail') reject(new Error(copy.error.message));
      else if (copy.type === 'call') {
        Promise.resolve(services[copy.name](copy.payload)).then((result) => {
          handle({ type: 'reply', callId: copy.callId, result: structuredClone(result, { transfer: [result.bytes.buffer] }) });
        });
      }
    };
    handle = createWorkerHandler(tasks, post);
    handle({ type: 'run', id: 1, task, payload: structuredClone(payload, { transfer: [] }) });
  });
}

async function pdfWithPicture() {
  const doc = await PDFDocument.create();
  doc.addPage([100, 100]).drawImage(await doc.embedJpg(tinyJpg), { x: 0, y: 0, width: 50, height: 25 });
  return doc.save();
}

describe('worker tasks', () => {
  it('merges two PDFs', async () => {
    const one = await pdfWithPicture();
    const result = await runLikeWorker('merge', { pdfs: [one, await pdfWithPicture()] });
    expect((await loadPdf(result)).getPageCount()).toBe(2);
  });
  it('builds pages in a new order', async () => {
    const doc = await PDFDocument.create();
    [100, 110].forEach((w) => doc.addPage([w, 50]));
    const result = await runLikeWorker('buildPages', { bytes: await doc.save(), pages: [{ index: 1 }, { index: 0, rotation: 90 }] });
    const out = await loadPdf(result);
    expect(out.getPage(0).getWidth()).toBe(110);
    expect(out.getPage(1).getRotation().angle).toBe(90);
  });
  it('compresses without emptying the PDF when pictures are handed to the page', async () => {
    const small = new Uint8Array(tinyJpg.length / 3);
    const calls = [];
    const result = await runLikeWorker('compress', { bytes: await pdfWithPicture(), maxSide: 800, quality: 0.5 }, {
      recompress: async ({ bytes }) => { calls.push(bytes.length); return { bytes: small.slice(), width: 8, height: 4 }; },
    });
    expect(calls).toEqual([tinyJpg.length]);
    const out = await loadPdf(result.bytes);
    expect(out.getPageCount()).toBe(1);
    expect(result.bytes.length).toBeGreaterThan(500);
  });
  it('reports a damaged file with its friendly key', async () => {
    await expect(runLikeWorker('buildPages', { bytes: new TextEncoder().encode('nope'), pages: [] })).rejects.toThrow();
  });
});
