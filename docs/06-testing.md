# Testing
- Run `npm test`. Tests sit next to the code as `*.test.js`.
- Covered: tool catalog, tool search, worker plumbing and tasks (with memory handed over like a real worker),  i18n keys, file checks, friendly errors, size text, tool list, and search pages and sitemap (titles, descriptions, escaping, one entry per page), project rules (file size, first-line comment, import direction, file names).
- Not covered by tests: how screens look, real PDF work in real browsers. Test those by hand, especially on a phone.

## Browsers and screens
- Tested by script in Chromium only, at widths 320, 360, 768, 1024, 1440 and 2560 (all 25 tool pages, Home, Privacy, Terms and Contact at 320, 768 and 1440; editor screens with a file loaded at 320), in English and Hindi: no sideways scroll, all buttons at least 52px.
- NOT tested: Firefox, Safari (Mac, iPhone, iPad), Samsung Internet, real phones. Please test these by hand.
- Also tested in Chromium: the built site served like Cloudflare Pages (pretty addresses, real 404, the strict Content-Security-Policy). NOT tested: the real Cloudflare Pages site (nothing is deployed yet).
- Worker: checked in Chromium that the worker starts and that the page-only fallback works when `Worker` is missing. NOT benchmarked on very large files or real phones.

## Step by step checks done in Chromium (real browser, built site, strict security headers)
- Every tool was run once with a real file and the saved result was opened with poppler (`pdftoppm`, `pdftotext`, `pdfinfo`) to look at it: Hindi text, tables, turned pages, redaction (hidden text gone), form fields, signatures, zip and image outputs.
- NOT tested: Firefox, Safari, Samsung Internet, real phones (touch drawing for pen, highlighter, signature; the phone camera button), very large PDFs (100 MB), and the real Cloudflare Pages site.
- Known weak spots, by design: compression helps little on text-only PDFs; Edit PDF cannot change original text; HTML to PDF keeps only plain content; Form Filler is English letters only; Redact pages become pictures; ZIP to PDF needs Chrome 103+, Safari 16.4+, Firefox 113+.

## Hand checklist after deploy (about 15 minutes)
1. Home: search for "sign", switch to Hindi.
2. Merge two PDFs; Compress a scanned PDF; PDF to JPG (zip opens).
3. TXT to PDF with a Hindi line; CSV to PDF with commas inside quotes; ZIP to PDF with 3 photos.
4. Redact: draw a box over a word, save, open the file and try to select the word (it must be gone).
5. Sign on a phone with a finger; Scanner with the phone camera.
6. Open one address that does not exist: you must see the "Page not found" page.
