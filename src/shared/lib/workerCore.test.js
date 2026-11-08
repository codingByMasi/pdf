// Tests for the worker plumbing, without a real worker.
import { describe, it, expect } from 'vitest';
import { createWorkerHandler, findTransferables, serializeError, deserializeError } from './workerCore.js';

describe('findTransferables', () => {
  it('finds whole arrays inside nested messages, once each', () => {
    const a = new Uint8Array(4);
    const b = new Uint8Array(8);
    const found = findTransferables({ pdfs: [a, b], again: a, name: 'x' });
    expect(found).toHaveLength(2);
    expect(found).toContain(a.buffer);
  });
  it('skips views that only show part of a bigger block', () => {
    const big = new Uint8Array(10);
    expect(findTransferables({ part: big.subarray(2, 5) })).toEqual([]);
  });
  it('handles plain values', () => {
    expect(findTransferables(null)).toEqual([]);
    expect(findTransferables('text')).toEqual([]);
  });
});

describe('errors', () => {
  it('keep their name, message and friendly key', () => {
    const copy = deserializeError(serializeError(Object.assign(new Error('boom'), { name: 'X', errorKey: 'error.corrupt' })));
    expect([copy.name, copy.message, copy.errorKey]).toEqual(['X', 'boom', 'error.corrupt']);
  });
});

describe('createWorkerHandler', () => {
  function setup(tasks) {
    const sent = [];
    const handle = createWorkerHandler(tasks, (message) => sent.push(message));
    return { sent, handle };
  }

  it('runs a task, reports progress, and sends the result', async () => {
    const { sent, handle } = setup({ double: async ({ n }, { onProgress }) => { onProgress(50); return n * 2; } });
    await handle({ type: 'run', id: 1, task: 'double', payload: { n: 21 } });
    expect(sent).toEqual([{ type: 'progress', id: 1, value: 50 }, { type: 'done', id: 1, result: 42 }]);
  });
  it('sends a failure for an unknown task or a thrown error', async () => {
    const { sent, handle } = setup({ bad: async () => { throw Object.assign(new Error('no'), { errorKey: 'error.corrupt' }); } });
    await handle({ type: 'run', id: 1, task: 'missing', payload: {} });
    await handle({ type: 'run', id: 2, task: 'bad', payload: {} });
    expect(sent[0].type).toBe('fail');
    expect(sent[1].error.errorKey).toBe('error.corrupt');
  });
  it('copies, and never hands over, data it sends to the page for help', async () => {
    const transfers = [];
    const handle = createWorkerHandler({ ask: async (_, { callMain }) => callMain('x', new Uint8Array(8)) }, (m, transfer) => transfers.push([m.type, transfer]));
    handle({ type: 'run', id: 1, task: 'ask', payload: {} });
    await Promise.resolve();
    expect(transfers[0]).toEqual(['call', []]);
  });
  it('lets a task ask the page for help and wait for the answer', async () => {
    const { sent, handle } = setup({ ask: async (_, { callMain }) => `got ${await callMain('twice', 4)}` });
    const running = handle({ type: 'run', id: 7, task: 'ask', payload: {} });
    await Promise.resolve();
    expect(sent[0]).toMatchObject({ type: 'call', id: 7, name: 'twice', payload: 4 });
    await handle({ type: 'reply', callId: sent[0].callId, result: 8 });
    await running;
    expect(sent[1]).toEqual({ type: 'done', id: 7, result: 'got 8' });
  });
});
