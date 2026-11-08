// The list of the 8 tools: id, web address, icon, and what kind of file each takes.
export const tools = [
  { id: 'merge', path: '/merge-pdf', icon: '🔗', kind: 'pdf', multiple: true },
  { id: 'split', path: '/split-pdf', icon: '✂️', kind: 'pdf', multiple: false },
  { id: 'rotate', path: '/rotate-pdf', icon: '🔄', kind: 'pdf', multiple: false },
  { id: 'delete', path: '/delete-pdf-pages', icon: '🗑️', kind: 'pdf', multiple: false },
  { id: 'imageToPdf', path: '/image-to-pdf', icon: '🖼️', kind: 'image', multiple: true },
  { id: 'pdfToImage', path: '/pdf-to-image', icon: '📷', kind: 'pdf', multiple: false },
  { id: 'watermark', path: '/watermark-pdf', icon: '💧', kind: 'pdf', multiple: false },
  { id: 'compress', path: '/compress-pdf', icon: '📦', kind: 'pdf', multiple: false },
];

export function findToolByPath(path) {
  return tools.find((tool) => tool.path === path);
}
