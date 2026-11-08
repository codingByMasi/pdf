// Makes a temporary download link for a file made in the browser, and frees it later.
export function makeDownloadUrl(blob) {
  return URL.createObjectURL(blob);
}

export function freeDownloadUrl(url) {
  if (url) URL.revokeObjectURL(url);
}
