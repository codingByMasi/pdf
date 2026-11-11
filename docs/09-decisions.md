# Decisions
Each extra library needs a written reason here.
- React + react-dom: the chosen UI base.
- Vite + @vitejs/plugin-react: builds the site.
- Vitest: test runner. It works with Vite and needs no extra setup.
- Own small router instead of a router library: the site has few pages, and it saves size.
- Security headers in `public/_headers`: Cloudflare Pages applies this file, and the build copies it.
- Site name inserted into index.html at build time from `config.js`, so the name stays in one place.
- pdf-lib: makes the new PDFs (merge, split, turn, delete). Works in the browser, no server.
- pdfjs-dist (pdf.js): draws page pictures. We use its "legacy" build so older phones and browsers work. Loaded only on tools that show page pictures.
- Own small zip maker (src/shared/lib/zipFiles.js) instead of a zip library: PDFs and pictures are already compressed, so we only need to pack them. Saves size. Checked with `unzip -t`.
- Rotate and Delete use buttons and tick boxes instead of drag and drop: drag is hard on phones and for keyboard users.
- Wide build target in vite.config.js (Chrome 80, Edge 88, Firefox 78, Safari 13.1) so the site runs on older browsers.
- Watermark uses the built-in Helvetica font, so it only draws English letters, numbers and simple signs. Hindi and other scripts need a font file plus the fontkit library (about 1 MB or more); not added yet. The tool says so clearly.
- Compress only shrinks JPG pictures (the common big part of scanned and photo PDFs). Other picture types and text are only re-saved. This is "basic" as agreed.
- Picture limits for PDF to image: at most 100 pages and 4096px / 16 million pixels per page, so phones do not run out of memory.
- Prerender with our own small script (scripts/prerender.js) instead of a prerender library: the site has 12 fixed pages, so we just copy the built index.html with the right title, tags and plain text. No extra library.
- Pages are written as `merge-pdf.html` (not folders) so Cloudflare Pages serves them at `/merge-pdf` with no trailing slash. We removed `_redirects`: with a `404.html` present, Pages gives unknown addresses a real 404.
- Question-and-answer data (FAQPage JSON-LD) is added to tool pages so search engines can show the questions.
- Contact is a `mailto:` link, not a form: a form needs a server and would collect personal data.
- Tool catalog is data only in `shared/lib/toolCatalog.js`; screens are connected in `features/tools/toolRegistry.js`. Reason: shared must not import from features, and the catalog also feeds the sitemap script.
- Web Worker for pdf-lib jobs, built as a module worker (`worker.format: 'es'`) so it can load pdf-lib on demand. Browsers that cannot start it (for example Safari before 15) use the main-thread fallback. Our own tiny message layer instead of a worker library.
- Decided with the user (2026-11-08), for later steps: (1) Hindi text in Edit, Sign, Watermark, TXT and CSV will use `fontkit` plus one small Hindi font (about 300 KB), loaded only on those tools. (2) ZIP to PDF will use our own zip reader built on the browser's decompression (needs Chrome 80, Safari 16.4 or Firefox 113 and newer; older browsers get a clear message). No zip library.
- Step (d) is split into two smaller steps.
- Hindi text (step c): `@pdf-lib/fontkit` (needed by pdf-lib to use our own fonts) plus `regenerator-runtime` (fontkit's Hindi letter-joining code needs it; without it Hindi fails with an error). Both load only when a tool that writes text runs. The font files are Noto Sans (SIL Open Font License, licence copy in src/assets/fonts) converted from WOFF2 to TTF once, because pdf-lib cannot embed WOFF2 (it produced blank pages). They are kept in the repo, not downloaded at build time. Joining of Hindi letters was checked by eye in the finished PDF.
- `happy-dom` (dev only, never shipped): lets a test run the browser's HTML parser to check that the HTML to PDF cleaner drops scripts, frames, forms and pictures.
- HTML to PDF is read by the page (DOMParser does not exist in a worker) and drawn in the worker. It is deliberately simple: no pictures, colours, styles or links.
- Letters the fonts do not have (emoji, many other scripts) are shown as "?" and the page says how many.
- ZIP to PDF needs `deflate-raw` in DecompressionStream: Chrome 103+, Edge 103+, Safari 16.4+, Firefox 113+. Older browsers get a clear message. (Earlier note said Chrome 80; Chrome only added this format in 103.)
- Page editor items are stored in "page-width units" (x from 0 to 1, y in the same unit) so drawing, resizing and saving use one simple scale on every page size. Saving maps them into the PDF with the same turned-page helper as Number Pages and Crop.
- Items can be moved, resized and nudged with buttons as well as by dragging, so the editor is usable with a keyboard. The pen and the box-drawing tools need a pointer (finger, pen or mouse).
- Redact rasterizes only the pages that have boxes (pdf.js, about 160 dpi, JPEG) and copies every other page unchanged. Other pages may still hold hidden text. The page says so.
- Form Filler uses the pdf-lib form with the standard font, so Hindi text is not offered there (it would need a font per field). Edit PDF is the route for Hindi.
- Typed signatures use the device's own handwriting-style font, drawn on a canvas and saved as a picture; the person sees what they get.
- Scanner uses the phone's own camera through a file chooser (`capture`) instead of a live camera view (`getUserMedia`). It works on every phone browser without a camera permission prompt, and the site keeps `camera=()` in its security headers. The cost: no live preview inside the page.
- Scanner works in the page's canvas (turn, crop, filter), then the existing picture-to-PDF worker job builds the file.

## Self-hosted fonts: @fontsource/dm-sans and @fontsource/manrope
- Why: the design uses DM Sans and Manrope. Loading them from Google Fonts would send visitors' requests to another company and break our strict security rule (default-src 'self').
- What: these two packages hold the font files. They are bundled into our own site, latin letters only, 5 small files. Hindi text uses the Noto or system font as before.
- Cost: no running cost, no outside request.

## Design port (ClearPDF)
- Site name is now "ClearPDF" in src/config.js (only place). A trailing "PDF" is shown in blue.
- We kept our 8 categories, our page addresses and our own Privacy/Terms text. The design's "Popular" group, fake processing and fake options were not copied.
- The contact form opens the visitor's email app (mailto). There is no server.

## Own QR encoder (step 4)
- What: src/shared/lib/qr, about 200 lines, byte mode, versions 1 to 10, levels L/M/Q/H.
- Why: a QR library is one more package to license and ship. The standard is free to use. Tested by reading codes back with a real QR reader (jsQR, test-time only, not shipped).
- Limit: text up to about 210 bytes at level M. Longer text gives a clear message.

## Licences file (step 4)
- What: scripts/licences.js writes dist/licences.txt at build time. Why: MIT, Apache and OFL licences ask that the licence text travels with the files.

## pako as a direct dependency (step 5)
- What: pako (MIT and Zlib), already inside pdf-lib, is now listed in package.json.
- Why: older browsers have no built-in unzip (DecompressionStream). Office files are zips, and the zip-to-PDF tool needed the same fallback. No new code is shipped; it was already in the bundle.

## Share pictures are made by a helper script that needs Playwright (search and sharing step)
- What: `scripts/makeShareImages.js` draws 1200x630 pictures for link previews (public/og/<lang>/<tool>.jpg). It is NOT part of `npm run build` and Playwright is NOT in package.json.
- Why: link previews on WhatsApp, X, Facebook and LinkedIn need a real picture file. Drawing needs a browser. The pictures are committed, so the owner never has to run the script unless tool names change. Run it with a machine that has Playwright (`npm i -g playwright`) and `node scripts/makeShareImages.js`.
- The pictures are not copied into the offline cache (they are only for social sites).

## Hindi text loads only when needed (speed)
- What: the Hindi text file is a separate download. English is always in the main file. The page waits for Hindi before it first draws when the address is /hi.
- Why: it cut the main file from 185 KB to 135 KB (gzip). Document makers load Hindi on demand when a PDF is made in Hindi.

## jsQR as a direct dependency (QR Reader)
- What: `jsqr` (Apache-2.0) is used only by the QR Reader tool and loads only when that tool is used.
- Why: reading a QR code from a picture means finding and decoding it from pixels. The built-in browser detector is missing in Firefox and Safari, and writing our own decoder is risky. It runs on the device; no image is sent anywhere.
