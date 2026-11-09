// The fixed parts every PowerPoint file needs (theme, master, blank layout), kept as small as possible.
import { relsFile, xmlFile } from './xmlWrite.js';

export const A = 'http://schemas.openxmlformats.org/drawingml/2006/main';
export const P = 'http://schemas.openxmlformats.org/presentationml/2006/main';
export const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

const fills = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
const line = '<a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>';
const colours = ['dk1:000000', 'lt1:FFFFFF', 'dk2:1F2937', 'lt2:F3F4F6', 'accent1:2E63E6', 'accent2:0F7B6C', 'accent3:B0414D', 'accent4:9A5212', 'accent5:8C4DC0', 'accent6:3D5A8F', 'hlink:2E63E6', 'folHlink:8C4DC0'];
const font = '<a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/>';

const theme = `<a:theme xmlns:a="${A}" name="Plain"><a:themeElements><a:clrScheme name="Plain">${colours.map((c) => { const [n, v] = c.split(':'); return `<a:${n}><a:srgbClr val="${v}"/></a:${n}>`; }).join('')}</a:clrScheme><a:fontScheme name="Plain"><a:majorFont>${font}</a:majorFont><a:minorFont>${font}</a:minorFont></a:fontScheme><a:fmtScheme name="Plain"><a:fillStyleLst>${fills}${fills}${fills}</a:fillStyleLst><a:lnStyleLst>${line}${line}${line}</a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst>${fills}${fills}${fills}</a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`;

const tree = '<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>';
const master = `<p:sldMaster xmlns:a="${A}" xmlns:r="${R}" xmlns:p="${P}">${tree}<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;
const layout = `<p:sldLayout xmlns:a="${A}" xmlns:r="${R}" xmlns:p="${P}" type="blank">${tree}</p:sldLayout>`;

export const fixedParts = () => [
  xmlFile('ppt/theme/theme1.xml', theme),
  xmlFile('ppt/slideMasters/slideMaster1.xml', master),
  relsFile('ppt/slideMasters/_rels/slideMaster1.xml.rels', [['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'], ['rId2', 'theme', '../theme/theme1.xml']]),
  xmlFile('ppt/slideLayouts/slideLayout1.xml', layout),
  relsFile('ppt/slideLayouts/_rels/slideLayout1.xml.rels', [['rId1', 'slideMaster', '../slideMasters/slideMaster1.xml']]),
];
