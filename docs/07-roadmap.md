# 07 - Master list (everything asked for)

One list of every tool and feature the owner asked for after the first 25 tools.
Status: `[x]` done and pushed, `[ ]` to do, `[-]` skipped (reason given). Tick items off when a step is pushed.
Every item must work fully in the browser, with no server and no upload.

## Left out on purpose (never to be built here)
- [-] OCR (scanned PDF to text): big and slow in a browser, and it counts as an AI tool.
- [-] Password lock and unlock for PDFs: ruled out earlier.
- [-] Certified digital signatures: need a server and a trusted authority.
- [-] AI background removal: needs an AI model. Only a simple colour-based remover may be built (weak, stated on its page).
- [-] Request signatures, Share PDF, PDF/A (full), all AI tools, Translate: need a server or AI.
- [-] Word, Excel, PowerPoint exact conversion (either direction): only rough, text-only versions are listed below.

## A. More PDF tools (step 1)
- [x] Reverse pages
- [x] Duplicate pages
- [x] Split by size
- [x] PDF info: add or edit title, author and other info
- [x] Add headers and footers
- [x] Bookmarks (table of contents)
- [x] Pages per sheet (2 or 4 per page) for printing
- [x] Resize pages to A4 or Letter
- [x] Compare two PDFs (text compare, page by page; no picture compare)
- [x] Extract all images from a PDF
- [x] PDF to text (also covers "extract text")

## B. More converts (step 2)
- [x] Markdown to PDF
- [x] Image to PDF for WebP
- [x] Image to PDF for HEIC (only in browsers that can open HEIC, such as Safari)
- [x] PDF to HTML / Markdown
- [x] Text to image, long image to PDF

## C. Site polish (step 3)
- [x] Install as an app, works offline
- [x] Dark mode
- [x] Remember recent settings (watermark text and similar; never files)
- [x] Drag to reorder pages
- [x] Zoom bar in the page editor (Annotate, Edit, Sign, Redact)

## D. Extra PDF tools
- [x] Compress PDF to a target size (for example under 200 KB)
- [x] Passport / ID photo sheet maker
- [x] Remove blank pages
- [x] Split by bookmarks or by blank page
- [x] Booklet printing
- [x] Grayscale or black and white PDF
- [x] Page borders, margins, blank page insert
- [x] Background colour and stamps (Approved, Draft). Picture backgrounds were not built.
- [x] QR code on pages (barcodes not built)
- [x] Attach files to a PDF, extract attachments
- [x] Highlight search results
- [x] Basic repair
- [x] PDF info viewer (size, pages, fonts, version)
- [-] Fast web view (linearize), basic PDF/A (not possible to do honestly in the browser: no safe linearizer, and real PDF/A needs checking tools)
- [x] Find and replace words (hide and retype overlay)

## E. Office files (basic only, limits stated on each page)
- [x] DOCX to PDF (plain text, headings, lists)
- [x] XLSX to PDF (cell values as a table)
- [x] PPTX to PDF (text of each slide)
- [x] PDF to Word (rough, text only)
- [x] PDF to Excel (rough, text only)
- [x] PDF to PowerPoint (rough, text only)

## F. Image tools
- [x] Resize
- [x] Compress
- [x] Crop
- [x] Rotate
- [x] Convert PNG / JPG / WebP
- [x] Image to a target size (for example 50 KB)
- [x] Remove EXIF data
- [x] Background remover (colour-based, weak)
- [x] Add text or watermark
- [x] Blur or hide parts
- [x] Collage / combine images
- [x] Black and white, or add a border
- [x] GIF maker, video frame grabber
- [x] Favicon maker, image to Base64 (both built)
- [x] Colour picker from an image

## G. Text and data tools
- [x] JSON formatter
- [x] CSV to JSON, JSON to CSV
- [x] Text diff (compare two texts)
- [x] Find and replace, remove duplicate lines, sort lines
- [x] Lorem ipsum, password generator
- [x] Base64 and URL encode / decode
- [x] Markdown preview
- [x] Text to speech (browser voice)
- [x] Word counter
- [x] Case converter
- [ ] QR code maker

## H. Calculators
- [x] Age
- [x] Date difference
- [x] EMI / loan
- [-] GST calculator: removed by the owner's choice.
- [x] Percentage
- [x] Unit converter
- [x] Number to words (rupees)

## I. Document makers (download a PDF)
- [x] Invoice / bill maker
- [x] Resume maker
- [x] Letter and application templates (English and Hindi)
- [x] Visiting card maker (ID card left out on purpose: it could be used to make a fake ID)
- [x] Name plate and certificate maker
- [x] Timetable / calendar maker
- [x] Hindi typing (English letters to Devanagari)

## J. Audio and video (small files only, limits stated)
- [ ] Audio trimmer and converter (small files)
- [ ] Voice recorder
- [ ] Screen recorder

## K. Site ideas (suggested by Claude, not yet asked for)
Tool favourites and recent tools row, share-a-tool link, several-files queue, blog and guides, more languages
(Spanish, Arabic, Bengali, Tamil, French), keyboard shortcuts and paste-a-file, visit counts without cookies.
Not built unless the owner asks.

## L. Later tools (queued after step J)
- [ ] Scan pack: merge images into a PDF with page size and margin choices
- [ ] Sign with a photo of your signature (background removed by colour)
- [ ] Date, time and name stamp on pages
- [ ] Table extractor: PDF tables to CSV (rough, text PDFs only)
- [ ] Page numbers in Hindi digits and other styles
- [ ] Saved details (name, address) kept on the device, to copy into forms
- [ ] Metadata cleaner for PDFs (author, device info)
- [ ] Resume checker (length, fonts, simple tips, no AI)
- [ ] Typing speed test, and typing practice in Hindi
- [ ] Currency, time zone and BMI calculators (currency rates need the internet: only with a clear note, or fixed manual rate)
- [ ] Hash / checksum tool (SHA-256 and others) to check a file was not changed
- [ ] Barcode maker (Code128, EAN) and QR reader from a photo
- [ ] Developer tools: colour palette and gradient maker, CSS minifier, regex tester

## M. Site items (queued after step J)
- [ ] "My recent tools" row and favourites on the home page, stored on the device
- [ ] Keyboard shortcuts, and paste a file from the clipboard
- [ ] Help page that explains common errors in plain words
- [ ] Hindi guides

## N. More languages (queued last)
- [ ] Bengali, Tamil, Marathi, Gujarati, Urdu (right-to-left), Arabic (right-to-left), Spanish
- Note: a machine translation is not good enough for a public site. Each language needs a native speaker to check it. Until then these stay partial files and fall back to English. Urdu and Arabic also need a right-to-left layout check.

## Launch (not tools, matters most)
- [ ] Deploy per docs/05-deploy.md, set siteUrl and contactEmail in src/config.js, have Privacy and Terms reviewed (docs/10-legal.md), test on real phones and in Firefox and Safari.
