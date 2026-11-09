// Turns the page texts of a PDF into a simple HTML page or Markdown text (rough: lines, no styling).
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

export function pagesToHtml(pages, title, pageWord) {
  const body = pages
    .map((text, i) => `<section>\n<h2>${escapeHtml(`${pageWord} ${i + 1}`)}</h2>\n${lines(text).map((line) => `<p>${escapeHtml(line)}</p>`).join('\n')}\n</section>`)
    .join('\n');
  return `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>${escapeHtml(title)}</title>\n<style>body{font-family:sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;line-height:1.6}</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}

// Markdown marks in the text are escaped with a backslash so they show as normal letters.
const escapeMarkdown = (line) => line.replace(/([\\`*_{}[\]<>#|])/g, '\\$1');

export function pagesToMarkdown(pages, pageWord) {
  return pages.map((text, i) => `## ${pageWord} ${i + 1}\n\n${lines(text).map(escapeMarkdown).join('\n\n')}\n`).join('\n');
}
