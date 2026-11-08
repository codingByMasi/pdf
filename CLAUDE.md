# CLAUDE.md - Project rules for PDF Tools

A free website for PDF jobs (merge, split, rotate, and more). Every tool runs in the visitor's browser. Files never leave the device. No backend, no database, no login.

The user is not deeply technical. Explain decisions in short, plain words. Be honest about what is not tested or not possible in the browser.

## Stack
- Vite + React (plain JavaScript) + plain CSS.
- PDF work: pdf-lib and pdf.js. Load pdf.js only on tools that need it (lazy load).
- No other library without a written reason in docs/09-decisions.md.
- Host: Cloudflare Pages.
- The site name "PDF Tools" lives in ONE place only: src/config.js.

## Launch tools (8)
1. Merge PDF
2. Split PDF (page range, or every page)
3. Rotate and reorder pages (with thumbnails)
4. Delete pages
5. Image to PDF (JPG, PNG)
6. PDF to image (PNG or JPG, zip download)
7. Watermark and page numbers
8. Compress (basic: re-save and shrink embedded images)

Each tool is one folder: src/features/tools/<toolName>/. All tools share the same drop-zone, file list, progress bar and download button from src/shared/ui.

## Pages
- Home: tool grid, one-line description each, and "Your files never leave your device."
- One page per tool: own title, 3-step "how to use", FAQ, own SEO title and description, own sitemap entry.
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

## Errors
- Never show technical words to users.
- Handle password-protected, corrupted and very large files with a clear message.
- Every tool has loading, empty and error states.

## Safety
- Validate file type and size in the browser.
- No secrets in the code.
- Security headers added at build time.
- Never show raw HTML from file contents.
- Never upload files anywhere. No analytics that send file data.

## Ads
- Ad slot components exist but stay OFF through a switch in src/config.js.

## Folder layout
CLAUDE.md, README.md, docs/ (01 overview, architecture, screens, i18n, deploy, testing, 09-decisions, CHANGELOG), public/, scripts/ (sitemap and prerender), src/ (main.jsx, App.jsx, config.js, app/, features/, shared/ui, shared/lib, shared/i18n, styles/).

## How to work
1. Plan first. Do not build until the user says "go".
2. Build ONE step at a time:
   (a) base layout, home page, shared pieces, i18n
   (b) tools 1-4
   (c) tools 5-8
   (d) SEO pages, sitemap, privacy/terms, deploy guide
3. After each step run `npm test` and `npm run build`. Fix every error. Then review like a strict code reviewer: security, edge cases, empty and error states, Hindi text, mobile width.
4. After each step list 3 to 5 lines: what changed and what to test by hand. Wait for "go".
5. Be honest about what is untested or impossible in the browser.
