// Packs PNG pictures into one .ico favicon file (modern browsers and Windows read PNG pictures inside .ico).
// pictures: [{ size, bytes }]. Returns the file bytes.
export function writeIco(pictures) {
  const head = 6 + pictures.length * 16;
  const total = pictures.reduce((n, p) => n + p.bytes.length, head);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, pictures.length, true);
  let offset = head;
  pictures.forEach((p, i) => {
    const at = 6 + i * 16;
    out[at] = p.size >= 256 ? 0 : p.size;
    out[at + 1] = p.size >= 256 ? 0 : p.size;
    view.setUint16(at + 4, 1, true);
    view.setUint16(at + 6, 32, true);
    view.setUint32(at + 8, p.bytes.length, true);
    view.setUint32(at + 12, offset, true);
    out.set(p.bytes, offset);
    offset += p.bytes.length;
  });
  return out;
}
