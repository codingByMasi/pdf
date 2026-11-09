// Writes a plain Word (.docx) file: one paragraph per line, a page break between PDF pages.
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { contentTypes, escapeXml, relsFile, xmlFile } from './xmlWrite.js';

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

// pages: [[line, line, ...], ...]. Returns the file bytes.
export function writeDocx(pages) {
  const body = pages
    .map((lines, i) => {
      const paragraphs = lines.map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`);
      if (paragraphs.length === 0) paragraphs.push('<w:p/>');
      if (i < pages.length - 1) paragraphs.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      return paragraphs.join('');
    })
    .join('');
  return makeZip([
    contentTypes([['/word/document.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml']]),
    relsFile('_rels/.rels', [['rId1', 'officeDocument', 'word/document.xml']]),
    xmlFile('word/document.xml', `<w:document xmlns:w="${W}"><w:body>${body}<w:sectPr/></w:body></w:document>`),
  ]);
}
