// Fingerprints (SHA-1, SHA-256, SHA-384, SHA-512) of a file or text, made by the browser itself. MD5 is not offered.
export const ALGORITHMS = ['SHA-256', 'SHA-1', 'SHA-384', 'SHA-512'];
export const MAX_BYTES = 300 * 1024 * 1024;

export const toHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function hashBytes(bytes, algorithm) {
  return toHex(await crypto.subtle.digest(algorithm, bytes));
}

// Ignores spaces, colons and capital letters, so a pasted fingerprint compares fairly.
export const cleanHash = (text) => text.replace(/[\s:]/g, '').toLowerCase();
export const sameHash = (a, b) => cleanHash(a) !== '' && cleanHash(a) === cleanHash(b);
