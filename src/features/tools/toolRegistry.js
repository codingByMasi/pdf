// Connects each tool id to its screen. Screens load only when opened.
import { lazy } from 'react';

export const toolScreens = {
  merge: lazy(() => import('./merge/MergeTool.jsx')),
  split: lazy(() => import('./split/SplitTool.jsx')),
  rotate: lazy(() => import('./rotate/RotateTool.jsx')),
  delete: lazy(() => import('./delete/DeleteTool.jsx')),
  extract: lazy(() => import('./extract/ExtractTool.jsx')),
  organize: lazy(() => import('./organize/OrganizeTool.jsx')),
  watermark: lazy(() => import('./watermark/WatermarkTool.jsx')),
  jpgToPdf: lazy(() => import('./jpgToPdf/JpgToPdfTool.jsx')),
  txtToPdf: lazy(() => import('./txtToPdf/TxtToPdfTool.jsx')),
  csvToPdf: lazy(() => import('./csvToPdf/CsvToPdfTool.jsx')),
  htmlToPdf: lazy(() => import('./htmlToPdf/HtmlToPdfTool.jsx')),
  zipToPdf: lazy(() => import('./zipToPdf/ZipToPdfTool.jsx')),
  pdfToJpg: lazy(() => import('./pdfToJpg/PdfToJpgTool.jsx')),
  pdfToPng: lazy(() => import('./pdfToPng/PdfToPngTool.jsx')),
  compress: lazy(() => import('./compress/CompressTool.jsx')),
};
