// Draws text onto a picture (a canvas) with a chosen width, text size and colours. Works with English and Hindi.
export const THEMES = {
  white: { background: '#ffffff', ink: '#17263d' },
  dark: { background: '#17263d', ink: '#f4f7ff' },
  note: { background: '#fff6c9', ink: '#3b2f00' },
};
const FONT = "'Noto Sans', 'Noto Sans Devanagari', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MAX_HEIGHT = 16000;

// Breaks a paragraph into lines no wider than maxWidth. A word longer than a line is cut by letters.
export function wrapLines(measure, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.replace(/\r\n?/g, '\n').split('\n')) {
    let line = '';
    for (const word of paragraph.split(/(\s+)/)) {
      if (!word) continue;
      if (measure(line + word) <= maxWidth || !line.trim()) {
        line += word;
        if (measure(line) > maxWidth) {
          let piece = '';
          for (const letter of Array.from(line)) {
            if (measure(piece + letter) > maxWidth && piece) { lines.push(piece); piece = ''; }
            piece += letter;
          }
          line = piece;
        }
      } else {
        lines.push(line.trimEnd());
        line = word.trimStart();
      }
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

// Returns { canvas, cut } where cut is true if the text was too long for one picture.
export function renderTextImage(text, { width = 1080, size = 40, theme = 'white' } = {}, makeCanvas = () => document.createElement('canvas')) {
  const colors = THEMES[theme] ?? THEMES.white;
  const pad = Math.round(size * 1.2);
  const canvas = makeCanvas();
  const context = canvas.getContext('2d');
  context.font = `${size}px ${FONT}`;
  const lines = wrapLines((s) => context.measureText(s).width, text, width - pad * 2);
  const lineHeight = Math.round(size * 1.5);
  const full = pad * 2 + lines.length * lineHeight;
  canvas.width = width;
  canvas.height = Math.min(full, MAX_HEIGHT);
  context.fillStyle = colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = colors.ink;
  context.font = `${size}px ${FONT}`;
  context.textBaseline = 'top';
  lines.forEach((line, i) => context.fillText(line, pad, pad + i * lineHeight + (lineHeight - size) / 2));
  return { canvas, cut: full > MAX_HEIGHT };
}
