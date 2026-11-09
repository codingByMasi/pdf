# Changelog
## Step (j): extra PDF tools
- 16 new tools: compress to size, remove blank pages, grayscale, margins and borders, background colour, stamp, booklet, repair, QR on pages, highlight words, find and replace, attach and extract files, split by bookmarks or blank pages, passport photo sheet, check PDF.
- Legal: Licences page and licences.txt, responsible-use notes on tools, Terms section 6, docs/10-legal.md.

## Step (i): site polish
- Dark mode (follows the device, with a switch). Install as an app and work offline (service worker written at build time).
- The site remembers recent options on this device only; a footer button forgets them.
- Drag to reorder pages and files (arrow buttons stay for keyboard). Zoom bar in the page editors.
- Limits: Firefox desktop cannot install the site as an app; iPhone uses Add to Home Screen. Zoom only scales the editor view.

## Step (h): more converts
- Markdown to PDF, long image to PDF, PDF to HTML, PDF to Markdown, text to image (new group Image tools).
- Pictures: WebP now works everywhere; HEIC only where the browser opens it (Safari).

## Step (g): 11 more PDF tools
- Reverse, duplicate, split by size, PDF info, header and footer, bookmarks, pages per sheet, resize to A4/Letter, compare, extract images, PDF to text.
- New group "Check and extract". Site name is now PDF Shortener (set in src/config.js only).

## Design port, part 2
- Language switch is now a two-part EN | हिन्दी control.
- Annotate, Edit, Sign and Redact editors sit in a card with a page strip (thumbnails), tool chips and a dotted stage.
- Not built from the design: zoom bar, drag-to-reorder, millimetre crop boxes (they would change how tools work).

## Design port
- New look from the ClearPDF design: colours, self-hosted fonts, icons, header with menu, dark footer, new home, tool page, info pages, contact form and 404.
- Added a Start over button after a download. Tools work as before.

## Step A - base
- Base layout, home page with 8-tool grid, tool page shell (steps, questions, working area).
- Shared pieces: drop-zone, file list, progress bar, download button, messages, ad slot (off).
- English and Hindi text with a key-match test.
- Security headers and redirects files.

## Step B - tools 1-4
- Merge PDF, Split PDF (page range, or every page as a zip), Rotate and reorder pages (page pictures), Delete pages.
- Shared: page-building helper, page-range reader, own small zip maker, loading/progress/error job hook, text box and choice group, page picture.
- Tools load only when opened. pdf.js (legacy build) loads only for the page-picture tools.
- Damaged and password-protected PDFs show plain messages.
- Build target widened for older browsers; focus ring has a fallback for older Safari.

## Step C - tools 5-8
- Image to PDF (JPG, PNG; phone photos stored sideways are turned upright; page size "same as photo" or A4).
- PDF to image (PNG or JPG, all pages in one zip; very large pages are scaled to stay inside browser limits).
- Watermark and page numbers (slanted text mark, page numbers bottom middle or right; works on turned pages; English letters, numbers and simple signs only).
- Compress (re-saves the file and shrinks big JPG pictures; shows the before and after size; says so when it cannot get smaller).
- Fixed: closing pdf.js documents used a call that does not exist in this version.

## Step D - SEO, text pages, deploy
- Each page has its own title, description, canonical address and social tags (English and Hindi in the browser tab).
- Prerendered HTML for all 12 pages plus 404.html; sitemap.xml and robots.txt made at build time.
- Privacy, Terms and Contact pages with footer links.
- `config.js` now has `siteUrl` and `contactEmail` (placeholders to change before launch).
- Deploy guide for Cloudflare Pages; `.node-version`; cache header for built files.

## Brief v2, step (a) - base, catalog, worker
- One tool catalog (`shared/lib/toolCatalog.js`) with categories; feeds home, tool pages, search, sitemap and prerender.
- Home: tools grouped by category, search box with clear button and spoken result count, "no result" message.
- Web Worker runner for pdf-lib jobs (merge, split, rotate/delete pages, JPG to PDF, watermark, compress) with progress and a page-only fallback.
- Tools renamed to the new list: JPG to PDF (`/jpg-to-pdf`), PDF to JPG (`/pdf-to-jpg`), PDF to PNG (`/pdf-to-png`).
- Removed the old roadmap file; the tools list is now `docs/03-tools.md`.
- Fixed while testing: handing a picture to the page for shrinking could empty the PDF's own data; call-backs now always copy.

## Brief v2, step (b) - Organize
- Rotate PDF (turn one page or all pages), Extract PDF Pages (tick pages or type numbers), Organize PDF (reorder, turn and remove in one place).
- Delete pages can also pick pages by typing numbers.
- Shared page-editing pieces in `features/tools/pageEditor/` (edit plans, page grids, selection tools).

## Brief v2, step (c) - Convert to PDF
- TXT to PDF, CSV to PDF, HTML to PDF (simple pages) and ZIP to PDF. TXT, CSV and HTML also accept pasted text.
- English and Hindi text in the PDFs: Noto Sans fonts (Latin and Hindi, normal and bold) are fetched only when one of these tools runs, and only the letters used are saved into the PDF.
- Shared pieces: font book, text wrapping, page writer, table drawing, CSV reader, text decoder (UTF-8, UTF-16 and old Windows text).
- HTML is read in an inert page, only an allow-list of plain content is kept (headings, paragraphs, lists, tables, bold). Scripts, styles, frames, forms, pictures and links are dropped and nothing is loaded.
- ZIP: own reader on the browser's built-in unzip, with limits on number of files, size and unpacked size.

## Brief v2, step (d1) - Number Pages, Crop, Watermark, Flatten
- Number Pages: top or bottom, left, middle or right; "1" or "1 / 10"; start number; skip the first page.
- Crop PDF: page 1 preview with shaded cut parts and four sliders; same share cut from every page; works on turned pages. Cut parts are hidden, not erased (the page says so).
- Watermark PDF now takes English and Hindi words (page numbers moved to their own tool).
- Flatten PDF: form fields only (text stays selectable) or everything (pages become pictures, 150 dpi, up to 100 pages).
- Fixed: pdf-lib left dead pointers to removed form fields after flattening; we remove them.

## Brief v2, step (d2) - Redact, Reader, Annotator, Form Filler, Edit PDF, Sign
- One shared page editor (`features/tools/overlay/`): page picture with an SVG layer, pen, highlighter, black box, rectangle, oval, line, text (English and Hindi), pictures; move, resize, nudge with buttons, delete, undo. Works on turned pages.
- Annotate and Edit PDF add things on top of pages. Edit PDF cannot change the original text and says so.
- Sign PDF: draw, type or upload a signature, place it, move it, resize it. It is a picture of a signature, not a certified digital signature.
- Redact PDF: pages with black boxes are redrawn as pictures with the boxes painted in, so the hidden text is truly gone (those pages lose text search). Other pages are kept as they are.
- PDF Reader: page by page with zoom (pages are pictures, so no text copy).
- Form Filler: text, tick boxes, drop-downs, radio buttons; optional lock after filling. English letters only (pdf-lib limit); forms without fields get a clear message.

## Brief v2, step (e) - Compress and Scanner
- Compress PDF: new "Strongest" choice that turns pages into small pictures (much smaller, text can no longer be selected). The two normal choices only shrink JPG pictures.
- PDF Scanner: take a photo (phone camera through the file chooser) or choose photos; turn left or right and cut the edges of each page; black and white, grey or colour look; A4 or photo-size pages; reorder and remove pages.
