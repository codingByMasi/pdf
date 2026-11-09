// Reads the text of each slide of a PowerPoint (.pptx) file: the title as a heading, the other lines as paragraphs.
import { blocksOf, decodeXml } from './xmlText.js';

const paragraphText = (p) => {
  let text = '';
  const re = /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>|<a:br\/>/g;
  for (let m = re.exec(p); m; m = re.exec(p)) text += m[1] !== undefined ? decodeXml(m[1]) : '\n';
  return text.trim();
};

// slides: [xml string] in slide order. Returns { blocks, slides }.
export function pptxBlocks(slides) {
  const blocks = [];
  slides.forEach((xml, i) => {
    blocks.push({ kind: 'heading', level: 3, runs: [{ text: `Slide ${i + 1}`, bold: true }], slide: true });
    for (const shape of blocksOf(xml, 'p:sp')) {
      const isTitle = /<p:ph[^>]*type="(title|ctrTitle)"/.test(shape);
      for (const p of blocksOf(shape, 'a:p')) {
        const text = paragraphText(p);
        if (!text) continue;
        const level = Number(/<a:pPr[^>]*\slvl="(\d)"/.exec(p)?.[1] ?? 0);
        if (isTitle) blocks.push({ kind: 'heading', level: 2, runs: [{ text, bold: true }] });
        else blocks.push({ kind: 'item', marker: '•', depth: Math.min(3, level), runs: [{ text, bold: false }] });
      }
    }
    blocks.push({ kind: 'rule' });
  });
  return { blocks, slides: slides.length };
}
