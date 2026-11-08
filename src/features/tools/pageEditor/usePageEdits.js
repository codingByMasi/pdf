// Holds the page edits (order, turns, removals) for the file being worked on, and resets for a new file.
import { useEffect, useState } from 'react';
import { hasChanges, keptPages, movePage, startEdits, toggleRemoved, turnAll, turnPage } from './pageEdits.js';

export function usePageEdits(file, numPages) {
  const [edits, setEdits] = useState([]);
  useEffect(() => setEdits(startEdits(numPages)), [file, numPages]);
  return {
    edits,
    changed: hasChanges(edits),
    kept: keptPages(edits),
    turn: (position, degrees) => setEdits((list) => turnPage(list, position, degrees)),
    turnEvery: (degrees) => setEdits((list) => turnAll(list, degrees)),
    move: (position, step) => setEdits((list) => movePage(list, position, step)),
    remove: (position) => setEdits((list) => toggleRemoved(list, position)),
  };
}
