// Tests that placed items really end up in the PDF, including Hindi text, pictures and turned pages.
import { describe, expect, it } from 'vitest';
import { PDFDocument, PDFName, PDFDict, degrees } from 'pdf-lib';
import { tinyPng } from '../../../shared/lib/testImages.js';
import { loadTestFont } from '../../../shared/lib/testFonts.js';
import { applyOverlays, itemsForWorker } from './applyOverlays.js';
import { makeBox, makeImage, makeLine, makePath, makeText } from './overlayModel.js';

async function sample(rotation = 0) {
  const doc = await PDFDocument.create();
  doc.addPage([300, 400]).setRotation(degrees(rotation));
  return doc.save();
}

const opts = { loadBytes: loadTestFont };
const all = () => [
  makePath([[0.1, 0.1], [0.2, 0.2], [0.3, 0.1]], '#d32f2f', 0.005),
  makeLine(0.1, 0.5, 0.6, 0.5, '#1a56db', 0.004),
  makeBox('rect', 0.1, 0.6, 0.3, 0.1, { fill: '#ffeb3b', opacity: 0.35, stroke: null, width: 0 }),
  makeBox('ellipse', 0.5, 0.6, 0.3, 0.1, { fill: null, opacity: 1, stroke: '#111111', width: 0.004 }),
  makeText(0.1, 0.8, 'नमस्ते Hello\nline two', 0.05, '#111111'),
  makeImage(0.5, 0.8, 0.2, 0.1, tinyPng, 'image/png', 'blob:x'),
];

describe('applyOverlays', () => {
  it('draws all kinds of items and loads the Hindi font', async () => {
    const { bytes, replaced } = await applyOverlays(await sample(), { 0: all() }, opts);
    expect(replaced).toBe(0);
    const doc = await PDFDocument.load(bytes);
    const names = doc.context
      .enumerateIndirectObjects()
      .filter(([, o]) => o instanceof PDFDict && o.get(PDFName.of('Type')) === PDFName.of('FontDescriptor'))
      .map(([, o]) => String(o.get(PDFName.of('FontName'))))
      .join();
    expect(names).toContain('Devanagari');
  });

  it('works on every page turn', async () => {
    for (const rotation of [90, 180, 270]) {
      const { bytes } = await applyOverlays(await sample(rotation), { 0: all() }, opts);
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    }
  });

  it('ignores pages that do not exist and strips picture addresses for the worker', async () => {
    const { bytes } = await applyOverlays(await sample(), { 7: all() }, opts);
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect(JSON.stringify(itemsForWorker({ 0: all() }))).not.toContain('blob:x');
  });
});
