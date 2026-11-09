// Helpers for writing the XML of Word, Excel and PowerPoint files.
export const escapeXml = (text) =>
  String(text)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const enc = new TextEncoder();
// Makes the file entries makeZip wants.
export const xmlFile = (name, body) => ({ name, data: enc.encode(XML_HEAD + body) });

export const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
export const PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';
export const CT = 'http://schemas.openxmlformats.org/package/2006/content-types';

export const relsFile = (name, rels) =>
  xmlFile(name, `<Relationships xmlns="${PKG_REL}">${rels.map(([id, type, target]) => `<Relationship Id="${id}" Type="${REL}/${type}" Target="${target}"/>`).join('')}</Relationships>`);

export const contentTypes = (overrides) =>
  xmlFile('[Content_Types].xml', `<Types xmlns="${CT}"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${overrides.map(([part, type]) => `<Override PartName="${part}" ContentType="${type}"/>`).join('')}</Types>`);
