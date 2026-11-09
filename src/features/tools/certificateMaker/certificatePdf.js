// Draws a plain certificate on A4 landscape: a border, a title, the person's name, a line of words and signing lines.
import { INK, SOFT, buildDoc, hexToRgb } from '../docKit/buildDoc.js';

export const KINDS = ['appreciation', 'participation', 'achievement', 'completion'];

// d: { kind, title (optional override), name, reason, org, date, signer, signerTitle, accent }. t: translate function.
export async function certificatePdf(d, t, { loadBytes } = {}) {
  const accent = hexToRgb(d.accent);
  const title = d.title.trim() || t(`cert.kind.${d.kind}`);
  return buildDoc([title, d.name, d.reason, d.org, d.signer, d.signerTitle, t('cert.presented'), t('cert.for')], (c) => {
    const { width: w, height: h } = c;
    c.box(24, 24, w - 48, h - 48, { stroke: accent, thickness: 4 });
    c.box(36, 36, w - 72, h - 72, { stroke: accent, thickness: 1 });
    const inner = w - 160;
    const x = 80;
    let y = h - 110;
    if (d.org) y -= c.textAt(d.org, { x, y, size: 15, face: 'bold', color: SOFT, align: 'center', width: inner }) + 14;
    y -= c.textAt(title, { x, y, size: 38, face: 'bold', color: accent, align: 'center', width: inner, maxLines: 2 }) + 18;
    y -= c.textAt(t('cert.presented'), { x, y, size: 14, color: SOFT, align: 'center', width: inner }) + 12;
    y -= c.textAt(d.name || ' ', { x, y, size: 34, face: 'bold', color: INK, align: 'center', width: inner, maxLines: 2 }) + 8;
    c.line(x + inner * 0.2, y, x + inner * 0.8, y, { color: accent, thickness: 1 });
    y -= 18;
    if (d.reason.trim()) c.textAt(`${t('cert.for')} ${d.reason}`, { x: x + 40, y, size: 15, color: INK, align: 'center', width: inner - 80, maxLines: 4, lineHeight: 1.5 });
    const base = 100;
    c.line(x + 20, base + 30, x + 220, base + 30);
    c.line(x + inner - 220, base + 30, x + inner - 20, base + 30);
    c.textAt(d.date, { x: x + 20, y: base + 24, size: 11, color: INK, align: 'center', width: 200 });
    c.textAt([d.signer, d.signerTitle].filter(Boolean).join('\n'), { x: x + inner - 220, y: base + 24, size: 11, color: INK, align: 'center', width: 200, maxLines: 3 });
  }, { size: 'a4-landscape', margin: 36, loadBytes });
}
