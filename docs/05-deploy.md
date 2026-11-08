# Deploy guide (Cloudflare Pages)

## Before the first deploy: change 3 things in `src/config.js`
1. `siteName` - the name shown on the site ("PDF Tools" is only a placeholder).
2. `siteUrl` - your real web address, like `https://mypdftools.com` (no slash at the end). It is used in the sitemap and in the search-engine tags.
3. `contactEmail` - a real email address that you read.
Then run `npm test` and `npm run build`.

## One-time setup (about 10 minutes)
1. Push the code to GitHub (already done: https://github.com/codingByMasi/pdf).
2. Log in at https://dash.cloudflare.com and open **Workers & Pages**.
3. Choose **Create**, then **Pages**, then **Connect to Git**. Pick the `pdf` repository.
4. Fill in:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable (only if the build uses a different Node version): `NODE_VERSION` = `22`. The file `.node-version` in the project already asks for 22.
5. Press **Save and Deploy**. Wait for the green "Success".
6. Open the `*.pages.dev` address Cloudflare gives you and test the site.

After this, every push to `main` deploys by itself.

## Your own domain
In the Pages project open **Custom domains**, press **Set up a domain**, and follow the steps. If the domain is already on Cloudflare it is automatic. After it works, make sure `siteUrl` in `config.js` is that exact address and deploy again.

## What the build makes
`npm run build` does three things:
1. `vite build` - the site itself, in `dist/`.
2. `node scripts/prerender.js` - one ready-made HTML file per page (for example `dist/merge-pdf.html`), so Google and others can read the text without running scripts. It also makes `dist/404.html`.
3. `node scripts/sitemap.js` - `dist/sitemap.xml` and `dist/robots.txt`.
`public/_headers` is copied into `dist/` and Cloudflare Pages applies it: security headers (including a strict Content-Security-Policy) and long caching for files in `/assets/`.
Cloudflare Pages shows `dist/404.html` with a real "404" status for unknown addresses.

## Checks after deploying
1. Open every tool on your phone. Add a file and download the result.
2. Open `https://your-domain/sitemap.xml` and `https://your-domain/robots.txt`.
3. Check the headers: `curl -I https://your-domain/` should show `content-security-policy`, `x-content-type-options` and `referrer-policy`.
4. Open a made-up address like `/abc` - you should see the "page not found" screen.
5. In Google Search Console, add the site and submit `sitemap.xml`.
6. Switch to Hindi and look at one tool page.

## Things to know
- If the Content-Security-Policy in `public/_headers` blocks something after you add a new feature, the browser console shows a "Refused to ..." message. Change the policy only as much as needed.
- Turning ads on (`ads.enabled` in `config.js`) needs a new policy and a new Privacy page text. Do not turn them on before that.
- Hindi and English share the same web address. Search engines see the English text. Separate Hindi addresses (like `/hi/merge-pdf`) can be added later if you want Hindi search traffic.
- Privacy and Terms are simple starter texts, not legal advice. Please have them checked by a lawyer before you launch, especially if you add ads or analytics.
- Fonts for English and Hindi text (about 450 KB in total) are files in `/assets/` served from your own site. They load only when a tool that writes text runs (TXT, CSV, HTML to PDF, Watermark, Edit, Sign). Nothing comes from Google Fonts or any outside site.
- The site makes 25 tool pages plus Home, Privacy, Terms and Contact (29 addresses in `sitemap.xml`). Free Cloudflare Pages limits (500 builds a month, 20,000 files) are far above this.
- Costs: Cloudflare Pages static hosting is free. A domain name (about 1 000 rupees a year) is the only thing you may want to pay for.
- Camera: the Scanner opens the phone's own camera app, so the site keeps the camera switched off in its security headers.
