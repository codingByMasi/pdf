# Architecture
- `src/app/` - page frame (header, footer, layout, language button).
- `src/features/` - what the site does: home page and the tools. Features may use `shared`.
- `src/shared/ui` - pieces used by every tool: drop-zone, file list, progress bar, download button, buttons, messages, ad slot.
- `src/shared/lib` - small helpers: file checks, friendly errors, size text, router, and `toolCatalog.js` (the one list of tools, data only), search, worker plumbing (`workerCore.js`).
- `src/shared/i18n` - all words (en.js, hi.js) and the translate code.
- `src/styles/` - plain CSS.
- `src/config.js` - site name, file limits, ads switch.
- `public/_headers` - security headers. Cloudflare Pages reads this file from the build.
- `scripts/` - run after the build: `prerender.js` (one HTML file per page and 404.html), `sitemap.js` (sitemap.xml and robots.txt).
- `src/features/pages/` - Privacy, Terms and Contact (plain text pages built from the text files).
Rule: `shared` never imports from `features`. A test checks this.
Pages: own tiny router (no library). Tool addresses and categories are in `shared/lib/toolCatalog.js`. The React screens are connected to the catalog in `features/tools/toolRegistry.js` (shared cannot import features).

## Worker
Heavy PDF jobs run in a Web Worker so the page stays smooth: `features/tools/worker/` has `taskList.js` (the jobs), `pdfWorker.js` (the worker), `workerClient.js` (sends jobs, shows progress, falls back to the page if workers are missing) and `runTask.js` (what screens call). Jobs that need a canvas (shrinking pictures) ask the page for help through the worker's call-back. Page pictures (pdf.js) stay on the page and yield between pages.
Handing memory to the worker empties it on the sending side, so only results and file bytes are handed over, and call-backs always copy.
