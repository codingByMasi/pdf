// After the build: writes dist/licences.txt with the licence text of every outside package and font that ships with the site.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Only packages whose code or files reach the visitor's browser.
export const SHIPPED = ['pdf-lib', '@pdf-lib/fontkit', '@pdf-lib/standard-fonts', '@pdf-lib/upng', 'pako', 'pdfjs-dist', 'react', 'react-dom', 'scheduler', 'regenerator-runtime', 'tslib', '@fontsource/dm-sans', '@fontsource/manrope'];

function licenceFile(dir) {
  const name = readdirSync(dir).find((file) => /^(licen[sc]e|copying)/i.test(file));
  return name ? readFileSync(join(dir, name), 'utf8').trim() : null;
}

// Returns [{ name, version, licence, text }].
export function collectLicences(base = root) {
  const entries = SHIPPED.map((name) => {
    const dir = join(base, 'node_modules', name);
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    const text = licenceFile(dir) ?? `${pkg.license} licence. Copyright ${typeof pkg.author === 'string' ? pkg.author : pkg.author?.name ?? 'the authors'}. (The package ships no separate licence file; see ${pkg.repository?.url ?? pkg.homepage ?? 'its home page'}.)`;
    return { name, version: pkg.version, licence: pkg.license, text };
  });
  const noto = join(base, 'src', 'assets', 'fonts', 'LICENSE-OFL.txt');
  if (existsSync(noto)) entries.push({ name: 'Noto Sans and Noto Sans Devanagari (fonts used inside created PDFs)', version: '', licence: 'OFL-1.1', text: readFileSync(noto, 'utf8').trim() });
  return entries;
}

export function renderLicences(entries) {
  const head = 'Outside software and fonts used by this site, with their licences.\nNone of it uses GPL, AGPL or non-commercial licences.\n';
  return `${head}\n${entries.map((e) => `${'='.repeat(70)}\n${e.name} ${e.version} - ${e.licence}\n${'='.repeat(70)}\n${e.text}\n`).join('\n')}`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const entries = collectLicences();
  writeFileSync(join(root, 'dist', 'licences.txt'), renderLicences(entries));
  console.log(`Wrote licences.txt with ${entries.length} licences`);
}
