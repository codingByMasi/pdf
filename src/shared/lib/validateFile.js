// Checks a chosen file's type and size in the browser. Returns a text key for any problem.
const KINDS = {
  pdf: { exts: ['pdf'], mimes: ['application/pdf'], accept: '.pdf,application/pdf' },
  image: {
    exts: ['jpg', 'jpeg', 'png'],
    mimes: ['image/jpeg', 'image/png'],
    accept: '.jpg,.jpeg,.png,image/jpeg,image/png',
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
