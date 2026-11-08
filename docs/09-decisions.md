# Decisions
Each extra library needs a written reason here.
- React + react-dom: the chosen UI base.
- Vite + @vitejs/plugin-react: builds the site.
- Vitest: test runner. It works with Vite and needs no extra setup.
- Own small router instead of a router library: the site has few pages, and it saves size.
- Security headers in `public/_headers`: Cloudflare Pages applies this file, and the build copies it.
- Site name inserted into index.html at build time from `config.js`, so the name stays in one place.
