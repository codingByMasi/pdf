// Developer helper (not part of the build): draws the share pictures in public/og/<lang>/<tool>.jpg. Run it again after changing tool names.
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/config.js';
import { en } from '../src/shared/i18n/en.js';
import { hi } from '../src/shared/i18n/hi.js';
import { tools } from '../src/shared/lib/toolCatalog.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = (name) => `data:font/ttf;base64,${readFileSync(join(root, 'src/assets/fonts', name)).toString('base64')}`;
const texts = { en, hi };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card(title, line, privacy) {
  return `<style>
@font-face{font-family:L;src:url(${font('latin-bold.ttf')})}
@font-face{font-family:D;src:url(${font('devanagari-bold.ttf')})}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;font-family:L,D,sans-serif;color:#fff;
background:linear-gradient(135deg,#1f3fa8 0%,#2e63e6 60%,#4f86f7 100%);padding:70px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{font-size:36px;opacity:.95}.t{font-size:${title.length > 34 ? 70 : 84}px;line-height:1.15;margin:0}
.d{font-size:36px;line-height:1.4;margin:22px 0 0;opacity:.92;font-weight:400}
.p{font-size:30px;background:rgba(255,255,255,.18);border-radius:40px;padding:12px 28px;align-self:flex-start}</style>
<div class="brand">${esc(config.siteName)}</div><div><h1 class="t">${esc(title)}</h1><p class="d">${esc(line)}</p></div><div class="p">${esc(privacy)}</div>`;
}

let chromium;
try {
  chromium = createRequire(import.meta.url)('playwright').chromium;
} catch {
  console.log('Playwright is needed only for this helper. Install it somewhere (npm i -g playwright) and run again.');
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ['en', 'hi']) {
  const t = texts[lang];
  const dir = join(root, 'public', 'og', lang);
  mkdirSync(dir, { recursive: true });
  const jobs = [['default', t['home.title'], t['home.subtitle']], ...tools.map((x) => [x.id, t[`tool.${x.id}.name`], t[`tool.${x.id}.desc`]])];
  for (const [id, title, line] of jobs) {
    await page.setContent(card(title, line, t['home.privacy']));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(dir, `${id}.jpg`), type: 'jpeg', quality: 82 });
  }
}
await browser.close();
console.log('Share pictures written to public/og');
