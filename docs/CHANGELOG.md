# Changelog
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
