// The tool group pages: one per category, with its own address and the words in the text files (hub.<category>.*).
const slugs = {
  organize: 'organize-pdf',
  edit: 'edit-pdf-tools',
  sign: 'sign-pdf-tools',
  toPdf: 'convert-to-pdf',
  toImage: 'pdf-to-image-tools',
  protect: 'protect-pdf-tools',
  compress: 'compress-pdf-tools',
  scan: 'scan-to-pdf-tools',
  inspect: 'check-pdf-files',
  image: 'image-tools',
  text: 'text-and-data-tools',
  calc: 'calculators',
  docs: 'document-makers',
  media: 'audio-video-tools',
};

export const hubs = Object.entries(slugs).map(([category, slug]) => ({ category, slug, path: `/tools/${slug}` }));
export const findHubByPath = (path) => hubs.find((h) => h.path === path);
export const hubForCategory = (category) => hubs.find((h) => h.category === category);
