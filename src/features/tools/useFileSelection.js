// Keeps the list of files a person added, checks each one, and lets them remove or reorder.
import { useState } from 'react';
import { config } from '../../config.js';
import { validateFile } from '../../shared/lib/validateFile.js';

let nextId = 1;

export function useFileSelection(tool) {
  const [items, setItems] = useState([]);
  const [errorKey, setErrorKey] = useState('');

  function addFiles(files) {
    const maxBytes = config.limits.maxFileMB * 1024 * 1024;
    const good = [];
    let problem = '';
    for (const file of files) {
      const result = validateFile(file, { kind: tool.kind, maxBytes });
      if (result.ok) good.push({ id: nextId++, file });
      else problem = result.errorKey;
    }
    let merged = items;
    if (tool.multiple) merged = [...items, ...good];
    else if (good.length) merged = [good[0]];
    if (merged.length > config.limits.maxFiles) {
      setErrorKey('error.tooMany');
      return;
    }
    setErrorKey(problem);
    setItems(merged);
  }

  function removeItem(id) {
    setErrorKey('');
    setItems((list) => list.filter((item) => item.id !== id));
  }

  function moveItem(id, step) {
    setItems((list) => {
      const from = list.findIndex((item) => item.id === id);
      const to = from + step;
      if (from < 0 || to < 0 || to >= list.length) return list;
      const copy = [...list];
      [copy[from], copy[to]] = [copy[to], copy[from]];
      return copy;
    });
  }

  return { items, errorKey, addFiles, removeItem, moveItem };
}
