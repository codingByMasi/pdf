// THE one list of tools (data only): id, address, category, icon name (see shared/ui/Icon.jsx), file kind. Feeds home, tool pages, search, sitemap.
export const categories = ['organize', 'edit', 'sign', 'toPdf', 'toImage', 'protect', 'compress', 'scan', 'inspect', 'image'];

// kind: what files the tool takes. multiple: can take many files. format: only for the picture exporters.
export const tools = [
  { id: 'merge', path: '/merge-pdf', category: 'organize', icon: 'merge', kind: 'pdf', multiple: true },
  { id: 'split', path: '/split-pdf', category: 'organize', icon: 'split', kind: 'pdf', multiple: false },
  { id: 'rotate', path: '/rotate-pdf', category: 'organize', icon: 'rotate', kind: 'pdf', multiple: false },
  { id: 'delete', path: '/delete-pdf-pages', category: 'organize', icon: 'trash', kind: 'pdf', multiple: false },
  { id: 'extract', path: '/extract-pdf-pages', category: 'organize', icon: 'extract', kind: 'pdf', multiple: false },
  { id: 'organize', path: '/organize-pdf', category: 'organize', icon: 'grid', kind: 'pdf', multiple: false },
  { id: 'reader', path: '/pdf-reader', category: 'edit', icon: 'reader', kind: 'pdf', multiple: false },
  { id: 'annotate', path: '/annotate-pdf', category: 'edit', icon: 'pen', kind: 'pdf', multiple: false },
  { id: 'formFill', path: '/fill-pdf-form', category: 'edit', icon: 'form', kind: 'pdf', multiple: false },
  { id: 'editPdf', path: '/edit-pdf', category: 'edit', icon: 'edit', kind: 'pdf', multiple: false },
  { id: 'redact', path: '/redact-pdf', category: 'edit', icon: 'redact', kind: 'pdf', multiple: false },
  { id: 'sign', path: '/sign-pdf', category: 'sign', icon: 'sign', kind: 'pdf', multiple: false },
  { id: 'numberPages', path: '/number-pdf-pages', category: 'edit', icon: 'number', kind: 'pdf', multiple: false },
  { id: 'crop', path: '/crop-pdf', category: 'edit', icon: 'crop', kind: 'pdf', multiple: false },
  { id: 'watermark', path: '/watermark-pdf', category: 'edit', icon: 'water', kind: 'pdf', multiple: false },
  { id: 'jpgToPdf', path: '/jpg-to-pdf', category: 'toPdf', icon: 'image', kind: 'image', multiple: true },
  { id: 'txtToPdf', path: '/txt-to-pdf', category: 'toPdf', icon: 'text', kind: 'txt', multiple: false },
  { id: 'csvToPdf', path: '/csv-to-pdf', category: 'toPdf', icon: 'table', kind: 'csv', multiple: false },
  { id: 'htmlToPdf', path: '/html-to-pdf', category: 'toPdf', icon: 'code', kind: 'html', multiple: false },
  { id: 'zipToPdf', path: '/zip-to-pdf', category: 'toPdf', icon: 'zip', kind: 'zip', multiple: false },
  { id: 'pdfToJpg', path: '/pdf-to-jpg', category: 'toImage', icon: 'image', kind: 'pdf', multiple: false, format: 'jpg' },
  { id: 'pdfToPng', path: '/pdf-to-png', category: 'toImage', icon: 'image', kind: 'pdf', multiple: false, format: 'png' },
  { id: 'flatten', path: '/flatten-pdf', category: 'protect', icon: 'layers', kind: 'pdf', multiple: false },
  { id: 'compress', path: '/compress-pdf', category: 'compress', icon: 'compress', kind: 'pdf', multiple: false },
  { id: 'scanner', path: '/pdf-scanner', category: 'scan', icon: 'scan', kind: 'image', multiple: true },
  { id: 'reverse', path: '/reverse-pdf-pages', category: 'organize', icon: 'reverse', kind: 'pdf', multiple: false },
  { id: 'duplicate', path: '/duplicate-pdf-pages', category: 'organize', icon: 'copy', kind: 'pdf', multiple: false },
  { id: 'splitSize', path: '/split-pdf-by-size', category: 'organize', icon: 'split', kind: 'pdf', multiple: false },
  { id: 'nUp', path: '/pdf-pages-per-sheet', category: 'organize', icon: 'nup', kind: 'pdf', multiple: false },
  { id: 'resize', path: '/resize-pdf-pages', category: 'organize', icon: 'resize', kind: 'pdf', multiple: false },
  { id: 'pdfInfo', path: '/edit-pdf-info', category: 'edit', icon: 'info', kind: 'pdf', multiple: false },
  { id: 'headerFooter', path: '/add-header-footer-pdf', category: 'edit', icon: 'header', kind: 'pdf', multiple: false },
  { id: 'bookmarks', path: '/add-pdf-bookmarks', category: 'edit', icon: 'bookmark', kind: 'pdf', multiple: false },
  { id: 'compare', path: '/compare-pdf', category: 'inspect', icon: 'compare', kind: 'pdf', multiple: true },
  { id: 'extractImages', path: '/extract-pdf-images', category: 'inspect', icon: 'image', kind: 'pdf', multiple: false },
  { id: 'pdfToText', path: '/pdf-to-text', category: 'inspect', icon: 'text', kind: 'pdf', multiple: false },
  { id: 'markdownToPdf', path: '/markdown-to-pdf', category: 'toPdf', icon: 'hash', kind: 'md', multiple: false },
  { id: 'longImageToPdf', path: '/long-image-to-pdf', category: 'toPdf', icon: 'image', kind: 'image', multiple: false },
  { id: 'pdfToHtml', path: '/pdf-to-html', category: 'inspect', icon: 'code', kind: 'pdf', multiple: false, format: 'html' },
  { id: 'pdfToMarkdown', path: '/pdf-to-markdown', category: 'inspect', icon: 'hash', kind: 'pdf', multiple: false, format: 'md' },
  { id: 'grayscale', path: '/pdf-to-grayscale', category: 'edit', icon: 'gray', kind: 'pdf', multiple: false },
  { id: 'removeBlank', path: '/remove-blank-pages', category: 'organize', icon: 'blank', kind: 'pdf', multiple: false },
  { id: 'pageBorders', path: '/add-margins-borders-pdf', category: 'edit', icon: 'frame', kind: 'pdf', multiple: false },
  { id: 'background', path: '/pdf-background-colour', category: 'edit', icon: 'palette', kind: 'pdf', multiple: false },
  { id: 'stamp', path: '/stamp-pdf', category: 'edit', icon: 'stamp', kind: 'pdf', multiple: false },
  { id: 'booklet', path: '/pdf-booklet', category: 'organize', icon: 'book', kind: 'pdf', multiple: false },
  { id: 'compressTarget', path: '/compress-pdf-to-size', category: 'compress', icon: 'target', kind: 'pdf', multiple: false },
  { id: 'repair', path: '/repair-pdf', category: 'protect', icon: 'wrench', kind: 'pdf', multiple: false },
  { id: 'textToImage', path: '/text-to-image', category: 'image', icon: 'image', kind: 'txt', multiple: false },
];

export function findToolByPath(path) {
  return tools.find((tool) => tool.path === path);
}

// Returns [{ category, tools }] in the fixed category order, skipping empty groups.
export function groupByCategory(list) {
  return categories
    .map((category) => ({ category, tools: list.filter((tool) => tool.category === category) }))
    .filter((group) => group.tools.length > 0);
}
