# 11 - Search and growth checklist

Nobody can promise a Google ranking. This list does the honest things that help: good pages, fast pages, clear titles, and people who share because the tool was useful. No fake reviews, no paid links, no keyword stuffing.

## What the site already does (built)
- Own title, description and web address for every page, in English and Hindi (/hi/...), with `hreflang` so Google shows the right language.
- Real text in the page before any script runs (prerendered), so search engines can read it.
- Structured data only where the same content is on the page (tool: app, how-to, questions, breadcrumb; guide: article, how-to, breadcrumb; home: organization). No star ratings.
- Share cards (Open Graph and Twitter) with a picture per tool, a sitemap with language links, and robots.txt.
- 16 how-to guides, 14 group pages and "Related tools" links, so pages link to each other.
- Share button and Copy link after a download. Nothing is tracked.
- Fast: no ads, no trackers, Hindi text loads only when needed. Lighthouse (phone settings, local copy): accessibility 100, best practices 100, SEO 100, performance 84-85.

## Before launch (you must do these)
1. Set `siteUrl` (your real address, no slash at the end) and `contactEmail` in `src/config.js`. Every canonical link, sitemap address and share picture address uses `siteUrl`. If it still says example.com, search engines will ignore the site.
2. Decide the site name. It is in `src/config.js` only. The home text still says "PDF" everywhere; the site now has image, text, calculator and document tools too.
3. Deploy (docs/05-deploy.md). Open `https://yoursite/sitemap.xml` and `https://yoursite/robots.txt` to check they load.
4. Have Privacy and Terms checked by a lawyer (docs/10-legal.md).

## Search engines (first week)
1. Google Search Console: add the site as a "Domain" property, verify with the DNS record, then Sitemaps > add `sitemap.xml`. Use "URL inspection" on the home page and 3-4 tools and press "Request indexing".
2. Bing Webmaster Tools: sign in, import the site from Search Console (one click), submit the sitemap. This also covers DuckDuckGo and Yahoo.
3. Watch Search Console > Pages for "Not indexed" reasons. New sites take days to weeks to appear. Do not resubmit every day.
4. After 4 weeks open Search Console > Performance. Look at which searches show your pages. Improve the titles of pages that get views but few clicks.

## Share pictures
- The pictures are in `public/og/`. If you rename tools or change the site name, run `node scripts/makeShareImages.js` (needs Playwright, see docs/09-decisions.md) and commit the new pictures.
- Test a link with the Facebook Sharing Debugger and the X/LinkedIn post preview after you deploy. WhatsApp caches previews, so a new link shows a fresh one.

## Getting visitors (honest ways)
- Product Hunt, Indie Hackers and Hacker News "Show HN": one honest post each. Say what it is: free, no upload, runs in the browser. Be ready to answer questions the same day.
- Free tool directories (AlternativeTo, SaaSHub, Slant). Skip AI directories: this site has no AI. Use the same short description everywhere.
- Reddit and forums: join the community first. Answer questions with real help. Mention the site only where the rules allow it and only when it solves the person's problem. Read each subreddit's self-promotion rules. Never post the same text in many places, and never use fake accounts.
- India: post in WhatsApp groups of students, job seekers and small shops. The guides "compress PDF to 200 KB" and "photo to 50 KB" match what people search before exam forms.
- Hindi: share the /hi guides on Hindi Facebook pages and YouTube. A short screen video of one guide is the best share.
- Backlinks that are fair: ask college and exam-help websites to link a guide; write a useful answer on Quora or StackExchange that links the guide; list the site in "free tools" lists. Do not buy links.
- Keep adding guides. One honest guide per common question (for example "how to compress a PDF for a visa form") is the strongest long-term search help.

## Counting visitors without cookies
- Cloudflare Web Analytics is free, has no cookies and does not track people across sites. Turn it on in the Cloudflare dashboard (Analytics > Web Analytics) for the site. It adds one small script, so also allow `static.cloudflareinsights.com` in `public/_headers` (script-src and connect-src), and update the Privacy page to mention it. Do this only if you want counts; the site works fine without.
- Files and text are never sent, with or without the counter.

## Checks to repeat after every big change
- `npm test`, `npm run build`.
- Home, one tool, one guide, one group page at 320, 768 and 1440 px, in English and Hindi: no sideways scroll.
- View source of a built page (`dist/merge-pdf.html`): title, description, canonical, hreflang, JSON-LD are present.
- Rich Results Test (search.google.com/test/rich-results) on a tool page and a guide page.
