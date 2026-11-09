// Finds the places of a word on all pages (main thread) and sends them to the worker to draw. Shared by Highlight and Find and Replace.
import { extractTextItems } from '../../../shared/lib/pdfTextItems.js';
import { runTask } from '../worker/runTask.js';
import { findMatches } from './findMatches.js';

let canvas;
// Relative width of text, measured with the browser's own font engine.
export function measureText(text) {
  canvas ??= document.createElement('canvas').getContext('2d');
  canvas.font = '100px sans-serif';
  return canvas.measureText(text).width;
}

// Returns { marks, count }; throws errorKey 'error.noMatches' when the word is not found.
export async function findAllMarks(file, query, options, onProgress) {
  const pages = await extractTextItems(file, (v) => onProgress(v * 0.6));
  const marks = [];
  pages.forEach((items, page) => findMatches(items, query, measureText, options).forEach((box) => marks.push({ ...box, page })));
  if (marks.length === 0) {
    const hasText = pages.some((items) => items.length > 0);
    throw Object.assign(new Error('no matches'), { errorKey: hasText ? 'error.noMatches' : 'error.noTextLayer' });
  }
  return marks;
}

export async function drawMarks(file, marks, mode, replacement, onProgress) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return runTask('marks', { bytes, marks, mode, replacement }, { onProgress: (v) => onProgress(60 + v * 0.4) });
}
