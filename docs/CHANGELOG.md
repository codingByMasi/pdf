# Changelog
## Step (p): audio and video
- Audio trimmer (cuts a part, saves WAV; own WAV writer), voice recorder, screen recorder (browser MediaRecorder). New group "Audio and video".
- No big libraries: no MP3 or video converting or trimming (needs ffmpeg or lame, which are heavy and have tricky licences).
- Permissions-Policy now allows microphone and screen capture for this site only. CSP got media-src blob: (needed for previews).
- Video frame grabber now fully tested (seeking works). Screen recorder does not work on most phones; the page says so.
## Step (o): document makers
- New group "Make a document": invoice (plain tax percent, no GST advice), resume, letters (leave, resignation, complaint; English or Hindi), visiting cards, certificate, name plate, calendar (year or month, English or Hindi), timetable. Hindi typing (English letters to Hindi) added to the text group.
- The GST calculator was removed at the owner's request (page, texts, SEO, notice). The invoice keeps only a plain "tax rate" field.
- The rupee sign now uses the Hindi font (the English font lacks it).
- ID card maker left out on purpose. Calendar shows no holidays (dates differ by place).
## Step (n): calculators
- New group "Calculators" (6 tools after the GST calculator was removed at the owner's request): age, date calculator, EMI, percentage, unit converter, number to words in rupees (English and Hindi).
- Dates are worked on as plain text (no time zone problems). Bigha is left out of the unit converter on purpose (it differs by state).
- Notes under EMI ("for guidance only") and number to words ("check before writing on a cheque").
- EMI checked against a known loan (10 lakh, 9%, 10 years = 12,667.58).
## Step (m): text and data tools
- New group "Text and data tools" (13 tools, no file needed): JSON formatter, CSV/JSON converter, text compare, find and replace, line tools, lorem ipsum, password maker, Base64/URL, Markdown preview, text to speech, word counter, case converter, QR code maker.
- New tool type "none" in the catalog for tools that take typed text instead of a file. Styles in src/styles/text.css. Colours for the next groups (calculators, documents, media) are added.
- QR codes checked by reading them back with jsQR. Text to speech depends on the voices on the device (not testable here).
## Step (l): more image tools
- Crop, hide parts (blocks or black), remove a plain background, add text or watermark (Hindi works), collage, GIF maker (own encoder, 256 colours), video frame grabber (new "video" file type).
- Picture styles moved to src/styles/images.css.
- Checked in Chrome only. The video grabber could not be fully tested here (the test browser refuses local video links), so test it by hand with a real MP4 or WebM. Seeking with the +/- buttons is also unchecked.
## Step (k): Office basics
- Word, Excel and PowerPoint to PDF (text only), PDF to Word, Excel and PowerPoint (rough, text only).
- The zip reader moved to shared/lib/zipRead.js and now works in older browsers too (pako).
- Checked with LibreOffice and python-docx/openpyxl/python-pptx. NOT checked with Microsoft Office itself.

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

## Search and sharing step
- Hindi pages have their own addresses: /hi, /hi/merge-pdf and so on. Both languages are prerendered, with canonical links, hreflang (en, hi, x-default), Open Graph and Twitter cards, and a share picture for every tool.
- Structured data (JSON-LD) only where the page shows the same content: WebApplication, HowTo, FAQPage and BreadcrumbList on tools; Organization and WebSite on home; Article, HowTo and BreadcrumbList on guides. No ratings or reviews.
- 16 how-to guides in English and Hindi (/guides), 14 group pages (/tools/<name>), "Related tools" on each tool page, link to the guide when there is one.
- Share line (Share button where the phone supports it, Copy link) on guides and after a download. Nothing is tracked.
- Sitemap lists every page in both languages with language links. robots.txt unchanged.
- Speed: Hindi text loads only when needed (main file 185 KB to 135 KB gzip); the empty box where a tool loads now keeps its height (layout shift 0.26 to 0.02). Lighthouse on a local copy (phone settings): accessibility 100, best practices 100, SEO 100, performance 84 to 85.
- docs/11-seo-growth.md has the launch checklist.

## Queued tools, batch 1 (PDF tools)
- Scan Pack (A4, Letter or fit; four margins), Signature from a Photo (paper made see-through, optional black or blue ink, PNG), Date, Time and Name Stamp (English and Hindi), PDF Table to CSV (rough, text PDFs only), PDF Metadata Cleaner, and Hindi or Roman digits in Number Pages.

## Queued tools, batch 2 (text and calculators)
- BMI calculator, time zone converter (browser clock data, no internet), currency converter (you type the rate), hash and checksum tool (SHA-1/256/384/512, no MD5), saved details (kept only on this device), resume checker (plain rules, no AI), typing speed test (English and Hindi).

## Queued tools, batch 3
- Barcode maker (Code 128 and EAN-13, checked with a second decoder), QR reader from a photo (jsQR), colour palette and gradient maker, CSS minifier, regex tester (runs in a worker, stopped after 2 seconds).

## Site items (list M)
- Home page rows "Your favourites" and "Used lately" (star button on each tool page), stored on the device and removed by Forget my settings.
- Press / on the home page to search; paste a copied file with Ctrl+V or Cmd+V on tool pages.
- Help page (/help) in English and Hindi. The 16 guides were already in Hindi.

## Copy polish
- Home headline, subtitle, footer line, app description, privacy and terms descriptions now say PDFs, photos and documents (not PDF only). Group jump buttons on the home page. Share pictures redrawn.

## SEO pass 2
- Text pages (Privacy, Terms, Contact, Help, Licences) have descriptive search titles instead of one-word titles.
- Tool pages show and mark up Home > Group > Tool breadcrumbs. Group pages list their tools as structured data (ItemList).
- Home group headings link to the group pages, and the footer links to all 14 group pages, so every tool is reachable in two clicks from every page.
- Share tags now include picture size and description text.

## Privacy and Terms for AdSense
- Privacy now has 10 sections (files, device storage, host, analytics, adverts and cookies, ad choices, Europe/UK consent, children, emails, changes) and Terms has 9 (adds adverts, our work and open-source, not professional advice). English and Hindi. Written fresh, not copied from any other site.
- New docs/12-adsense.md: AdSense checklist and the security-rule changes needed when ads go live. Ads stay off.

## About page
- New /about page (English and Hindi), linked in the footer, in the sitemap (now 332 addresses). Written honestly: what the site is, how it works, its limits, how to reach us. It does not name a person; add one if you want.

## AdSense setup (dormant) and 6 more guides
- Ads stay off. config.ads now has publisherId and slots. scripts/adsSetup.js writes ads.txt and widens the security rules only when ads are on. src/shared/lib/adScript.js loads Google's script only when allowed. AdSlot shows one footer advert when set up.
- 6 new guides (22 in all), English and Hindi: hide private details (redact), scan with a phone, shrink a PDF for email, resize a photo for forms, work out a loan EMI, save only some pages.

## Privacy page, round 2
- Privacy now has 13 sections. New or fuller: schools and children, how long we keep things (we keep no files; emails deleted after about 12 months), data in other countries, your rights and a privacy contact (reply within 30 days). Written fresh.

## Honest limits on four tool pages
- Currency Converter, Resume Checker, PDF Table to CSV and Date/Name Stamp now show a short note saying what they do not do (typed rate, rules not AI, rough and text-only, plain not certified).

## AdSense site check
- Publisher ID is in config. Every page now carries a google-adsense-account meta label (a plain label, no ad code, no cookies) so Google can verify ownership. Ads stay off.
- Also added Google's own site-check script to every page head (as asked), plus ads.txt and the security-rule change, because a publisher id is now set. Ads still show nowhere.
