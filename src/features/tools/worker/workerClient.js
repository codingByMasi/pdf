// Runs a named task in a Web Worker (so the page stays smooth), or on the page itself if workers fail.
import { deserializeError, findTransferables, runDirect } from '../../../shared/lib/workerCore.js';

const READY_TIMEOUT_MS = 4000;

// createWorker() makes a worker. loadTasks() loads the task list for the no-worker fallback. Both can be replaced in tests.
export function createWorkerClient({ createWorker, loadTasks }) {
  let worker = null;
  let ready = null;
  let broken = false;
  let nextId = 1;
  const pending = new Map();

  function giveUp(error) {
    broken = true;
    worker?.terminate?.();
    worker = null;
    ready = null;
    for (const job of pending.values()) job.reject(error);
    pending.clear();
  }

  function onMessage(event) {
    const message = event.data;
    if (message.type === 'pong') return;
    const job = pending.get(message.id);
    if (!job) return;
    if (message.type === 'progress') job.onProgress?.(message.value);
    else if (message.type === 'done') {
      pending.delete(message.id);
      job.resolve(message.result);
    } else if (message.type === 'fail') {
      pending.delete(message.id);
      job.reject(deserializeError(message.error));
    } else if (message.type === 'call') {
      Promise.resolve()
        .then(() => job.services[message.name](message.payload))
        .then(
          (result) => worker.postMessage({ type: 'reply', callId: message.callId, result }, findTransferables(result)),
          (error) => worker.postMessage({ type: 'reply', callId: message.callId, error: { name: error?.name, message: error?.message } }),
        );
    }
  }

  // Starts the worker once and waits until it answers a ping, so we know it really works.
  function start() {
    if (broken) return Promise.resolve(false);
    if (ready) return ready;
    ready = new Promise((resolve) => {
      let timer;
      try {
        worker = createWorker();
      } catch {
        giveUp(new Error('no worker'));
        resolve(false);
        return;
      }
      const check = (event) => {
        if (event.data?.type === 'pong') {
          clearTimeout(timer);
          resolve(true);
        }
      };
      worker.addEventListener('message', check);
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', () => {
        clearTimeout(timer);
        giveUp(new Error('worker error'));
        resolve(false);
      });
      timer = setTimeout(() => {
        giveUp(new Error('worker timeout'));
        resolve(false);
      }, READY_TIMEOUT_MS);
      worker.postMessage({ type: 'ping' });
    });
    return ready;
  }

  async function runOnPage(name, payload, { onProgress, services = {} }) {
    const tasks = await loadTasks();
    const callMain = async (service, data) => services[service](data);
    return runDirect(tasks, name, payload, { onProgress: onProgress ?? (() => {}), callMain });
  }

  // services: functions the worker may call back on the page (for example, picture shrinking).
  async function run(name, payload, { onProgress, services = {} } = {}) {
    if (await start()) {
      try {
        return await new Promise((resolve, reject) => {
          const id = nextId;
          nextId += 1;
          pending.set(id, { resolve, reject, onProgress, services });
          worker.postMessage({ type: 'run', id, task: name, payload }, findTransferables(payload));
        });
      } catch (error) {
        if (!broken) throw error;
        // The worker died while running: tell the person with a plain message.
        throw Object.assign(new Error('worker stopped'), { errorKey: 'error.generic' });
      }
    }
    return runOnPage(name, payload, { onProgress, services });
  }

  return { run };
}

