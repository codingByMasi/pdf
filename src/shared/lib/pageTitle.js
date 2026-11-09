// Builds the tab title: "Page | Site name" while it fits in 70 letters, otherwise just the page title.
export function pageTitle(title, siteName) {
  if (!title) return siteName;
  const full = `${title} | ${siteName}`;
  return full.length <= 70 ? full : title;
}

// Real address of a page in a language: ("hi", "/merge-pdf") gives "/hi/merge-pdf".
export function addressFor(lang, path) {
  if (lang !== 'hi') return path;
  return path === '/' ? '/hi' : `/hi${path}`;
}
