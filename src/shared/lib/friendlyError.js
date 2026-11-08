// Maps any thrown error to a plain-words text key, never showing technical words.
export function friendlyErrorKey(error) {
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`.toLowerCase();
  if (/password|encrypt/.test(text)) return 'error.password';
  if (/memory|too large|quota/.test(text)) return 'error.tooBig';
  if (/invalid|corrupt|parse|malformed|header|xref|unexpected/.test(text)) return 'error.corrupt';
  return 'error.generic';
}
