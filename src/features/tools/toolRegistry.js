// Connects each tool id to its screen. Screens load only when opened. Missing ones show the placeholder.
import { lazy } from 'react';

export const toolScreens = {
  merge: lazy(() => import('./merge/MergeTool.jsx')),
  split: lazy(() => import('./split/SplitTool.jsx')),
  rotate: lazy(() => import('./rotate/RotateTool.jsx')),
  delete: lazy(() => import('./delete/DeleteTool.jsx')),
};

export const placeholderScreen = lazy(() => import('./PlaceholderTool.jsx'));
