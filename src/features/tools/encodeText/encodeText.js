// Base64 and web-address (URL) encoding of text, safe for Hindi and other languages (UTF-8).
export function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

// Returns { ok, text } ; accepts the web-safe form and missing "=" signs.
export function fromBase64(text) {
  try {
    const clean = text.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(clean.padEnd(Math.ceil(clean.length / 4) * 4, '='));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { ok: true, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) };
  } catch {
    return { ok: false };
  }
}

export const toUrl = (text) => encodeURIComponent(text);
export function fromUrl(text) {
  try {
    return { ok: true, text: decodeURIComponent(text.replace(/\+/g, ' ')) };
  } catch {
    return { ok: false };
  }
}

export const MODES = ['b64enc', 'b64dec', 'urlenc', 'urldec'];
export function runEncode(mode, text) {
  if (mode === 'b64enc') return { ok: true, text: toBase64(text) };
  if (mode === 'b64dec') return fromBase64(text);
  if (mode === 'urlenc') return { ok: true, text: toUrl(text) };
  return fromUrl(text);
}
