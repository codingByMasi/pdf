// The one function tool screens call to run a job: runTask('merge', { pdfs }, { onProgress }).
import { createWorkerClient } from './workerClient.js';

const client = createWorkerClient({
  createWorker: () => new Worker(new URL('./pdfWorker.js', import.meta.url), { type: 'module' }),
  loadTasks: async () => (await import('./taskList.js')).tasks,
});

export const runTask = client.run;
