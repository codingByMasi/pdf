// Connects each tool id to its screen. Screens load only when opened.
import { lazy } from 'react';

export const toolScreens = {
  merge: lazy(() => import('./merge/MergeTool.jsx')),
  split: lazy(() => import('./split/SplitTool.jsx')),
  rotate: lazy(() => import('./rotate/RotateTool.jsx')),
  delete: lazy(() => import('./delete/DeleteTool.jsx')),
  imageToPdf: lazy(() => import('./imageToPdf/ImageToPdfTool.jsx')),
  pdfToImage: lazy(() => import('./pdfToImage/PdfToImageTool.jsx')),
  watermark: lazy(() => import('./watermark/WatermarkTool.jsx')),
  compress: lazy(() => import('./compress/CompressTool.jsx')),
};
