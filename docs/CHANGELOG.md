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
