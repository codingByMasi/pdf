# AdSense readiness

Ads stay OFF (`ads.enabled` in src/config.js) until Google approves the site and the steps below are done. Google changes its rules, so check each item at support.google.com/adsense before you apply.

## What the owner needs (account side)
1. Be 18 or older, with one AdSense account, a bank account and a real address for the payment PIN and tax form.
2. Own the domain (pdfshortener.com) and be able to edit the site files.
3. The site is public, live over HTTPS, and not behind a login.
4. Apply at adsense.google.com, add the site, and put the code Google gives you where it asks. Wait for review (days to a few weeks).

## What Google checks on the site
- **Original, useful content.** Tool pages with real how-to text and FAQ, plus the 16 guides. This is our strongest part. Add more guides over time (one honest, useful guide per popular tool).
- **Not "low value".** Pages that are only a tool and a button can be rejected as thin. Keep the how-to and FAQ on every tool page and keep adding guides.
- **Privacy Policy** that names Google, cookies and ad choices (done, English and Hindi, see /privacy). Have a lawyer read it before ads go live.
- **Terms, Contact page, About-style page.** Done (/terms, /contact). About page done (/about).
- **Easy navigation.** Home, group pages, footer links, search. Done.
- **No copied text, no copyright problems, nothing illegal.** Done; see docs/10-legal.md.
- **No prohibited content.** Our tools that could be misused have notices. Do not add fake-document, fake-ID or similar tools.
- **Good on phones, fast, no broken pages.** Lighthouse a11y/best practices/SEO 100; speed about 85 on a local test.
- **Traffic.** Never click your own ads, never ask others to, never buy fake traffic. Some countries need the site to be some months old.
- **Ad placement rules.** No ads on screens without real content, no ads that look like buttons, no more ads than content, nothing covering the tool.

## Switching ads on (the setup is built; ads are still OFF)
When Google approves the site:
1. In AdSense, turn on the free "Privacy & messaging" consent message for Europe, the UK and Switzerland (Google's script shows it; no code needed).
2. Create one ad unit and copy its slot number.
3. In src/config.js set `ads: { enabled: true, publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', slots: { footer: 'SLOT NUMBER' } }`.
4. Run `npm run build`. With ads on, the build does three things by itself (scripts/adsSetup.js):
   - writes dist/ads.txt with your publisher ID,
   - adds the Google sources to the security rules in dist/_headers (check the list in scripts/adsSetup.js against Google's AdSense security-policy page),
   - stops with a clear error if the publisher ID is missing or has the wrong shape.
5. The ad code loads only when ads are on, set up and the visitor is online (src/shared/lib/adScript.js). Offline visitors never see ads, and the offline copy never stores Google files.
6. Deploy, then test: all pages at 320/768/1440, the tools still work, and no "no cookies" wording is left on the home page, Help or footer.
7. Change the Privacy page date and, if you add more ad places, add a slot name in config and an AdSlot component for it. Keep ads away from the tool area.

## Honest notes
- Approval is Google's decision. A tool-only site can be rejected for "low value content"; adding more real guides is the fix.
- Ads add cookies. After they are on, the "no cookies, no tracking" claims on other pages (home, Help, footer) must be changed to match.
- None of this is legal advice. Have a lawyer check Privacy and Terms, especially for India's data protection law and for visitors from Europe.
