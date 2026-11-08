# CLAUDE.md - Project rules for PDF Tools

A free website for PDF jobs, like ilovepdf. Every tool runs in the visitor's browser. Files never leave the device. No login, no backend, no database, no paid service, no running cost beyond free static hosting.

The user is not deeply technical. Explain decisions in short, plain words. Be honest about what is not tested, what is weaker than ilovepdf, and what is not possible in the browser. If a tool cannot work well fully in the browser, do NOT build it and tell the user.

## Stack
- Vite + React (plain JavaScript) + plain CSS.
- PDF work: pdf-lib and pdf.js. Load pdf.js and other heavy code only on the tools that need it.
- A small zip library is allowed only if really needed for many-file downloads (we have our own zip maker, so probably never).
- No other library without a written reason in docs/09-decisions.md.
- Host: Cloudflare Pages.
- The site name "PDF Tools" lives in ONE place only: src/config.js.

## The 25 tools (all browser-only, all free)
- Organize: 1 Merge PDF, 2 Split PDF (page ranges or every page), 3 Rotate PDF, 4 Delete PDF Pages, 5 Extract PDF Pages, 6 Organize PDF (reorder with thumbnails).
- Edit: 7 Number Pages, 8 Crop PDF, 9 Watermark PDF, 10 Redact PDF (basic: black boxes burned into the page so the hidden text is truly gone), 11 PDF Reader, 12 PDF Annotator (draw, highlight, add text), 13 PDF Form Filler, 14 Edit PDF (add text, images, shapes on top; it cannot rewrite the original text, and the page says so).
- Fill & Sign: 15 Sign PDF (draw, type or upload a signature, place it on the page).
- Convert to PDF: 16 JPG to PDF (also PNG), 17 TXT to PDF, 18 CSV to PDF, 19 HTML to PDF (simple pages only), 20 ZIP to PDF (images inside a zip).
- PDF to Image: 21 PDF to JPG, 22 PDF to PNG (many pages download as a zip).
- Protect: 23 Flatten PDF.
- Compress: 24 Compress PDF (basic: re-save and shrink embedded images; say honestly it helps little on text-only PDFs).
- Scan: 25 PDF Scanner (phone camera or photos to PDF, with crop and rotate).

NOT BUILT (need a server or a paid service, never add): PDF to Word/Excel/PPT, Word/Excel/PPT to PDF, ODT/ODS/ODP/RTF/HWP/EPUB/Pages to PDF, OCR, PDF/A, all AI tools, Translate, Unlock/Protect with passwords, Request Signatures, Share PDF.

## Tool structure
- Each tool is its own folder: src/features/tools/<toolName>/.
- All tools share the drop-zone, file list, progress bar and download button from src/shared/ui.
- All tools are listed in ONE place: src/shared/lib/toolCatalog.js (data only: id, address, category, icon, file kind). The catalog feeds the home page, the tool pages, the search box, the sitemap and the prerender script. Shared code never imports from features, so the screens (the React parts) are connected to the catalog in src/features/tools/toolRegistry.js.

## Pages
- Home: tools grouped by the categories above, a one-line description each, a search box, and "Your files never leave your device."
- One page per tool: own title, a 3-step "how to use", a short FAQ, own SEO title and description, own sitemap entry.
- Privacy, Terms, Contact, 404.

## Languages
- English and Hindi. No words inside components.
- All text lives in src/shared/i18n/en.js and hi.js with the same keys. A test checks this.
- Keep Hindi simple. Other languages may be added later as partial files.

## Code rules
- Names: components PascalCase.jsx, everything else camelCase.js, CSS classes kebab-case.
- One job per file. Under 200 lines (text files excepted).
- Every file starts with a one-line comment saying what it is for.
- Imports go one way: features may use shared. Shared never imports from features.
- Tests sit next to the code as *.test.js.

## Accessibility and mobile
- Mobile first. Most users are on phones.
- Large text and buttons. 52px minimum tap size.
- Visible keyboard focus. A label on every input.
- Respect reduced motion.

## Browsers and screens
- Must work in all common browsers: Chrome, Edge, Firefox, Safari (including iPhone and iPad), Samsung Internet, and recent older versions of each.
- Must work on all screens: from 320px wide phones up to very wide desktops. Mobile first. No sideways scrolling at any width.
- Build target is set wide in vite.config.js. Use the pdf.js "legacy" build so older browsers work.
- Do not use a browser feature that only some browsers have unless there is a fallback.
- Say plainly which browsers and widths were tested and which were not.

## Performance
- Big files are processed in a Web Worker so the page does not freeze, with a progress bar.
- Work that needs a canvas (page pictures) stays on the main thread in small steps (yield between pages) unless the browser supports OffscreenCanvas.
- If a Worker cannot start, fall back to the main thread.

## Errors
- Never show technical words to users.
- Handle password-protected, corrupted and very large files with a clear message.
- Every tool has loading, empty and error states.

## Safety
- Validate file type and size in the browser.
- No secrets in the code.
- Security headers written at build time (public/_headers).
- Never show raw HTML from file contents. HTML to PDF must sanitize its input: parse it in an inert document (DOMParser), keep only an allow-list of tags, never run scripts, never load outside links or pictures.
- Never upload files anywhere. No analytics that send file data.

## Ads
- Ad slot components exist but stay OFF through a switch in src/config.js.

## Folder layout
CLAUDE.md, README.md, docs/ (01 overview, 02 architecture, 03 tools list, 04 i18n, 05 deploy, 06 testing, 09 decisions, CHANGELOG), public/, scripts/ (sitemap and prerender), src/ (main.jsx, App.jsx, config.js, app/, features/, shared/ui, shared/lib, shared/i18n, styles/).

## How to work
1. Plan first. Do not build until the user says "go".
2. Build ONE step at a time:
   (a) base layout, home (grouped, with search), shared pieces, tool catalog, worker runner, i18n
   (b) Organize tools 1-6
   (c) Convert-to-PDF and PDF-to-image tools 16-22
   (d) Edit tools 7-14, Sign 15, Flatten 23
   (e) Compress 24 and Scanner 25
   (f) SEO pages, sitemap, privacy/terms, deploy guide
3. Each step: create, test (`npm test`), push to GitHub, build (`npm run build`), test again. Fix every error. Then review like a strict code reviewer: security, edge cases, empty and error states, Hindi text, mobile width.
4. After each step list 3 to 5 lines: what changed and what to test by hand. Wait for "go".
5. Be honest about what is untested, weaker than ilovepdf (for example compression and editing existing text), or impossible in the browser.
