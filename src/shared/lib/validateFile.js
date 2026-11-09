// Checks a chosen file's type and size in the browser. Returns a text key for any problem.
const KINDS = {
  pdf: { exts: ['pdf'], mimes: ['application/pdf'], accept: '.pdf,application/pdf' },
  image: {
    exts: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'],
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    accept: '.jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif',
  },
  md: { exts: ['md', 'markdown', 'txt'], mimes: ['text/markdown', 'text/x-markdown', 'text/plain'], accept: '.md,.markdown,.txt,text/markdown,text/plain' },
  txt: { exts: ['txt', 'text'], mimes: ['text/plain'], accept: '.txt,.text,text/plain' },
  csv: {
    exts: ['csv', 'tsv'],
    mimes: ['text/csv', 'text/tab-separated-values', 'text/plain', 'application/vnd.ms-excel', 'application/csv'],
    accept: '.csv,.tsv,text/csv,text/plain',
  },
  html: { exts: ['html', 'htm'], mimes: ['text/html', 'application/xhtml+xml'], accept: '.html,.htm,text/html' },
  docx: { exts: ['docx'], mimes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'], accept: '.docx' },
  xlsx: { exts: ['xlsx'], mimes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'], accept: '.xlsx' },
  pptx: { exts: ['pptx'], mimes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'], accept: '.pptx' },
  audio: { exts: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'oga', 'opus', 'webm', 'flac'], mimes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/opus', 'audio/webm', 'audio/flac', 'audio/x-flac', 'video/webm', 'video/mp4'], accept: '.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.webm,audio/*' },
  video: { exts: ['mp4', 'webm', 'mov', 'm4v', 'ogv'], mimes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/ogg'], accept: '.mp4,.webm,.mov,.m4v,.ogv,video/*' },
  zip: {
    exts: ['zip'],
    mimes: ['application/zip', 'application/x-zip-compressed', 'application/x-zip', 'multipart/x-zip'],
    accept: '.zip,application/zip',
  },
};

export function acceptFor(kind) {
  return KINDS[kind]?.accept ?? '';
}

export function validateFile(file, { kind, maxBytes }) {
  if (!file || file.size === 0) return { ok: false, errorKey: 'error.empty' };
  const spec = KINDS[kind];
  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase() : '';
  const mimeOk = !file.type || spec?.mimes.includes(file.type);
  if (!spec || !spec.exts.includes(ext) || !mimeOk) return { ok: false, errorKey: 'error.wrongType' };
  if (file.size > maxBytes) return { ok: false, errorKey: 'error.tooBig' };
  return { ok: true };
}
