// Worker that runs the regex away from the page, so a slow pattern cannot freeze the screen.
import { runRegex } from './regexRun.js';

self.onmessage = (event) => {
  const { pattern, flags, text } = event.data;
  self.postMessage(runRegex(pattern, flags, text));
};
