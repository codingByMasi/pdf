# Architecture
- `src/app/` - page frame (header, footer, layout, language button).
- `src/features/` - what the site does: home page and the tools. Features may use `shared`.
- `src/shared/ui` - pieces used by every tool: drop-zone, file list, progress bar, download button, buttons, messages, ad slot.
- `src/shared/lib` - small helpers: file checks, friendly errors, size text, router.
- `src/shared/i18n` - all words (en.js, hi.js) and the translate code.
- `src/styles/` - plain CSS.
- `src/config.js` - site name, file limits, ads switch.
- `public/_headers` - security headers. Cloudflare Pages reads this file from the build.
- `scripts/` - run after the build: `prerender.js` (one HTML file per page and 404.html), `sitemap.js` (sitemap.xml and robots.txt).
- `src/features/pages/` - Privacy, Terms and Contact (plain text pages built from the text files).
Rule: `shared` never imports from `features`. A test checks this.
Pages: own tiny router (no library). Tool addresses are listed in `features/tools/toolList.js`.
