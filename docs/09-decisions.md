# Decisions
Each extra library needs a written reason here.
- React + react-dom: the chosen UI base.
- Vite + @vitejs/plugin-react: builds the site.
- Vitest: test runner. It works with Vite and needs no extra setup.
- Own small router instead of a router library: the site has few pages, and it saves size.
- Security headers in `public/_headers`: Cloudflare Pages applies this file, and the build copies it.
- Site name inserted into index.html at build time from `config.js`, so the name stays in one place.
- pdf-lib: makes the new PDFs (merge, split, turn, delete). Works in the browser, no server.
- pdfjs-dist (pdf.js): draws page pictures. We use its "legacy" build so older phones and browsers work. Loaded only on tools that show page pictures.
- Own small zip maker (src/shared/lib/zipFiles.js) instead of a zip library: PDFs and pictures are already compressed, so we only need to pack them. Saves size. Checked with `unzip -t`.
- Rotate and Delete use buttons and tick boxes instead of drag and drop: drag is hard on phones and for keyboard users.
- Wide build target in vite.config.js (Chrome 80, Edge 88, Firefox 78, Safari 13.1) so the site runs on older browsers.
- Watermark uses the built-in Helvetica font, so it only draws English letters, numbers and simple signs. Hindi and other scripts need a font file plus the fontkit library (about 1 MB or more); not added yet. The tool says so clearly.
- Compress only shrinks JPG pictures (the common big part of scanned and photo PDFs). Other picture types and text are only re-saved. This is "basic" as agreed.
- Picture limits for PDF to image: at most 100 pages and 4096px / 16 million pixels per page, so phones do not run out of memory.
