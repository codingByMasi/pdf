// The Web Worker itself: receives task messages and runs them away from the page.
import { createWorkerHandler } from '../../../shared/lib/workerCore.js';
import { tasks } from './taskList.js';

const handle = createWorkerHandler(tasks, (message, transfer) => self.postMessage(message, transfer));

self.onmessage = (event) => {
  if (event.data.type === 'ping') self.postMessage({ type: 'pong' });
  else handle(event.data);
};
