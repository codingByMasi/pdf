// Worker plumbing that works anywhere: runs named tasks, sends progress, and asks the page for help.
const MAX_DEPTH = 4;

// Finds the big memory blocks inside a message, so they are handed over instead of copied.
export function findTransferables(value, found = new Set(), depth = 0) {
  if (!value || typeof value !== 'object' || depth > MAX_DEPTH) return [];
  if (value instanceof ArrayBuffer) found.add(value);
  else if (ArrayBuffer.isView(value)) {
    if (value.byteOffset === 0 && value.byteLength === value.buffer.byteLength && value.buffer instanceof ArrayBuffer) {
      found.add(value.buffer);
    }
  } else {
    for (const item of Array.isArray(value) ? value : Object.values(value)) findTransferables(item, found, depth + 1);
  }
  return [...found];
}

export function serializeError(error) {
  return { name: error?.name ?? 'Error', message: error?.message ?? '', errorKey: error?.errorKey };
}

export function deserializeError(data) {
  return Object.assign(new Error(data.message), { name: data.name, errorKey: data.errorKey });
}

// post(message, transferList) sends a message to the page. Returns handle(message) for incoming messages.
export function createWorkerHandler(tasks, post) {
  const waiting = new Map();
  let nextCall = 1;

  return async function handle(message) {
    if (message.type === 'reply') {
      const call = waiting.get(message.callId);
      waiting.delete(message.callId);
      if (!call) return;
      if (message.error) call.reject(deserializeError(message.error));
      else call.resolve(message.result);
      return;
    }
    if (message.type !== 'run') return;

    const { id, task, payload } = message;
    const callMain = (name, data) =>
      new Promise((resolve, reject) => {
        const callId = nextCall;
        nextCall += 1;
        waiting.set(callId, { resolve, reject });
        // Copied, never handed over: the data may be part of the worker's own working memory.
        post({ type: 'call', id, callId, name, payload: data }, []);
      });
    try {
      if (!tasks[task]) throw new Error(`Unknown task ${task}`);
      const result = await tasks[task](payload, { onProgress: (value) => post({ type: 'progress', id, value }, []), callMain });
      post({ type: 'done', id, result }, findTransferables(result));
    } catch (error) {
      post({ type: 'fail', id, error: serializeError(error) }, []);
    }
  };
}

// Runs a task right here (no worker). Same task code, same progress and callback behaviour.
export async function runDirect(tasks, name, payload, services) {
  if (!tasks[name]) throw new Error(`Unknown task ${name}`);
  return tasks[name](payload, services);
}
