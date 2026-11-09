// Writes a plain PowerPoint (.pptx) file: one slide per PDF page with the page's text in a box (long pages are cut to fit).
import { makeZip } from '../../../shared/lib/zipFiles.js';
import { A, P, R, fixedParts } from './pptxParts.js';
import { contentTypes, escapeXml, relsFile, xmlFile } from './xmlWrite.js';

const EMU = 12700;
const WIDE = 960 * EMU;
const HIGH = 540 * EMU;
const MAX_LINES = 22;

// slides: [{ title, lines: [] }]. Returns the file bytes.
export function writePptx(slides) {
  const list = slides.length ? slides : [{ title: '', lines: [] }];
  const box = (id, name, x, y, w, h, size, bold, lines) =>
    `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr wrap="square"><a:normAutofit/></a:bodyPr><a:lstStyle/>${lines.map((l) => `<a:p><a:r><a:rPr lang="en-US" sz="${size}" b="${bold ? 1 : 0}"/><a:t>${escapeXml(l)}</a:t></a:r></a:p>`).join('') || '<a:p/>'}</p:txBody></p:sp>`;
  const slideXml = (s) =>
    `<p:sld xmlns:a="${A}" xmlns:r="${R}" xmlns:p="${P}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>${box(2, 'Title', 40 * EMU, 20 * EMU, WIDE - 80 * EMU, 50 * EMU, 2800, true, [s.title])}${box(3, 'Text', 40 * EMU, 80 * EMU, WIDE - 80 * EMU, HIGH - 100 * EMU, 1600, false, s.lines.slice(0, MAX_LINES))}</p:spTree></p:cSld></p:sld>`;
  const parts = [
    contentTypes([
      ['/ppt/presentation.xml', 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'],
      ['/ppt/slideMasters/slideMaster1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'],
      ['/ppt/slideLayouts/slideLayout1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'],
      ['/ppt/theme/theme1.xml', 'application/vnd.openxmlformats-officedocument.theme+xml'],
      ...list.map((_, i) => [`/ppt/slides/slide${i + 1}.xml`, 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml']),
    ]),
    relsFile('_rels/.rels', [['rId1', 'officeDocument', 'ppt/presentation.xml']]),
    xmlFile('ppt/presentation.xml', `<p:presentation xmlns:a="${A}" xmlns:r="${R}" xmlns:p="${P}"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${list.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`).join('')}</p:sldIdLst><p:sldSz cx="${WIDE}" cy="${HIGH}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`),
    relsFile('ppt/_rels/presentation.xml.rels', [['rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'], ...list.map((_, i) => [`rId${i + 2}`, 'slide', `slides/slide${i + 1}.xml`])]),
    ...fixedParts(),
  ];
  list.forEach((s, i) => {
    parts.push(xmlFile(`ppt/slides/slide${i + 1}.xml`, slideXml(s)));
    parts.push(relsFile(`ppt/slides/_rels/slide${i + 1}.xml.rels`, [['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml']]));
  });
  return makeZip(parts);
}
