// Tells JPG from PNG by looking at the first bytes of the file, not the name.
export function sniffImageType(bytes) {
  if (bytes.length > 3 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png';
  if (bytes.length > 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg';
  return null;
}

// Tells WebP and HEIC/HEIF pictures apart (browsers may or may not be able to open them).
export function sniffOtherImage(bytes) {
  const text = (from, to) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes.length > 12 && text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP') return 'webp';
  if (bytes.length > 12 && text(4, 8) === 'ftyp' && /^(heic|heix|hevc|hevx|heim|heis|mif1|msf1)$/.test(text(8, 12))) return 'heic';
  return null;
}
