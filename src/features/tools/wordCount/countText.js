// Counts words, characters, sentences, paragraphs and reading time. Works with Hindi too.
export function countText(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? (trimmed.match(/[^.!?।]+[.!?।]+|[^.!?।]+$/g) ?? []).filter((s) => s.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const characters = [...text].length;
  const noSpaces = [...text.replace(/\s/g, '')].length;
  return { words, characters, noSpaces, sentences, paragraphs, lines: text ? text.split('\n').length : 0, readMinutes: words ? Math.max(1, Math.round(words / 200)) : 0 };
}
