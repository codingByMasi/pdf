// THE one list of tools (data only): id, address, category, icon, file kind. Feeds home, tool pages, search, sitemap.
export const categories = ['organize', 'edit', 'sign', 'toPdf', 'toImage', 'protect', 'compress', 'scan'];

// kind: what files the tool takes. multiple: can take many files. format: only for the picture exporters.
export const tools = [
  { id: 'merge', path: '/merge-pdf', category: 'organize', icon: '🔗', kind: 'pdf', multiple: true },
  { id: 'split', path: '/split-pdf', category: 'organize', icon: '✂️', kind: 'pdf', multiple: false },
  { id: 'rotate', path: '/rotate-pdf', category: 'organize', icon: '🔄', kind: 'pdf', multiple: false },
  { id: 'delete', path: '/delete-pdf-pages', category: 'organize', icon: '🗑️', kind: 'pdf', multiple: false },
  { id: 'watermark', path: '/watermark-pdf', category: 'edit', icon: '💧', kind: 'pdf', multiple: false },
  { id: 'jpgToPdf', path: '/jpg-to-pdf', category: 'toPdf', icon: '🖼️', kind: 'image', multiple: true },
  { id: 'pdfToJpg', path: '/pdf-to-jpg', category: 'toImage', icon: '📷', kind: 'pdf', multiple: false, format: 'jpg' },
  { id: 'pdfToPng', path: '/pdf-to-png', category: 'toImage', icon: '🎞️', kind: 'pdf', multiple: false, format: 'png' },
  { id: 'compress', path: '/compress-pdf', category: 'compress', icon: '📦', kind: 'pdf', multiple: false },
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
