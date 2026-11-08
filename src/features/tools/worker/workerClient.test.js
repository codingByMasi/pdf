// Tests the worker client with a pretend worker, including the "no worker" fallback.
import { describe, it, expect } from 'vitest';
import { createWorkerHandler } from '../../../shared/lib/workerCore.js';
import { createWorkerClient } from './workerClient.js';

const tasks = {
  double: async ({ n }, { onProgress }) => { onProgress(100); return n * 2; },
  boom: async () => { throw Object.assign(new Error('bad file'), { errorKey: 'error.corrupt' }); },
  ask: async (_, { callMain }) => callMain('plusOne', 1),
};

// A pretend worker: the same handler the real worker uses, wired through plain functions.
function fakeWorker({ answerPing = true } = {}) {
  const listeners = [];
  const toPage = (data) => queueMicrotask(() => listeners.forEach((fn) => fn({ data })));
  const handle = createWorkerHandler(tasks, (message) => toPage(message));
  return {
    addEventListener: (type, fn) => type === 'message' && listeners.push(fn),
    postMessage: (message) => {
      if (message.type === 'ping') { if (answerPing) toPage({ type: 'pong' }); } else handle(message);
    },
    terminate: () => {},
  };
}

const loadTasks = async () => tasks;

describe('worker client', () => {
  it('runs a task in the worker with progress', async () => {
    const seen = [];
    const { run } = createWorkerClient({ createWorker: () => fakeWorker(), loadTasks: async () => { throw new Error('should not be used'); } });
    expect(await run('double', { n: 4 }, { onProgress: (v) => seen.push(v) })).toBe(8);
    expect(seen).toEqual([100]);
  });
  it('passes back a task error with its friendly key', async () => {
    const { run } = createWorkerClient({ createWorker: () => fakeWorker(), loadTasks });
    await expect(run('boom', {})).rejects.toMatchObject({ errorKey: 'error.corrupt' });
  });
  it('lets the worker call a page service', async () => {
    const { run } = createWorkerClient({ createWorker: () => fakeWorker(), loadTasks });
    expect(await run('ask', {}, { services: { plusOne: (n) => n + 1 } })).toBe(2);
  });
  it('falls back to the page when a worker cannot be made', async () => {
    const { run } = createWorkerClient({ createWorker: () => { throw new Error('no Worker'); }, loadTasks });
    expect(await run('double', { n: 5 })).toBe(10);
    await expect(run('boom', {})).rejects.toMatchObject({ errorKey: 'error.corrupt' });
    expect(await run('ask', {}, { services: { plusOne: (n) => n + 10 } })).toBe(11);
  });
  it('falls back to the page when the worker never answers', async () => {
    const { run } = createWorkerClient({ createWorker: () => fakeWorker({ answerPing: false }), loadTasks });
    expect(await run('double', { n: 1 })).toBe(2);
  }, 10000);
});
