// The how-to guides: address and which tool each one is about. The words are in guideTextEn.js and guideTextHi.js.
export const guides = [
  { slug: 'merge-pdf-on-iphone', tool: 'merge' },
  { slug: 'compress-pdf-to-200kb', tool: 'compressTarget' },
  { slug: 'split-pdf-into-pages', tool: 'split' },
  { slug: 'convert-photos-to-pdf-on-phone', tool: 'jpgToPdf' },
  { slug: 'rotate-pdf-pages', tool: 'rotate' },
  { slug: 'delete-pages-from-pdf', tool: 'delete' },
  { slug: 'sign-pdf-without-printing', tool: 'sign' },
  { slug: 'fill-pdf-form-online', tool: 'formFill' },
  { slug: 'passport-photo-sheet-at-home', tool: 'photoSheet' },
  { slug: 'compress-image-to-50kb', tool: 'imageTarget' },
  { slug: 'remove-location-from-photos', tool: 'imageExif' },
  { slug: 'pdf-to-jpg-high-quality', tool: 'pdfToJpg' },
  { slug: 'add-page-numbers-to-pdf', tool: 'numberPages' },
  { slug: 'add-watermark-to-pdf', tool: 'watermark' },
  { slug: 'make-an-invoice-pdf-free', tool: 'invoiceMaker' },
  { slug: 'type-hindi-with-english-letters', tool: 'hindiTyping' },
  { slug: 'redact-private-information-in-pdf', tool: 'redact' },
  { slug: 'scan-documents-to-pdf-with-phone', tool: 'scanner' },
  { slug: 'reduce-pdf-size-for-email', tool: 'compress' },
  { slug: 'resize-photo-for-online-forms', tool: 'imageResize' },
  { slug: 'calculate-loan-emi', tool: 'emiCalc' },
  { slug: 'extract-pages-from-pdf', tool: 'extract' },
].map((g) => ({ ...g, path: `/guides/${g.slug}` }));

export const guidesPath = '/guides';
export const findGuideByPath = (path) => guides.find((g) => g.path === path);
export const guideForTool = (toolId) => guides.find((g) => g.tool === toolId);
export const GUIDE_DATE = '2026-11-09';
