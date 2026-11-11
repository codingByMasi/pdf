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
- **Terms, Contact page, About-style page.** Done (/terms, /contact). Consider adding a short About page saying who runs the site.
- **Easy navigation.** Home, group pages, footer links, search. Done.
- **No copied text, no copyright problems, nothing illegal.** Done; see docs/10-legal.md.
- **No prohibited content.** Our tools that could be misused have notices. Do not add fake-document, fake-ID or similar tools.
- **Good on phones, fast, no broken pages.** Lighthouse a11y/best practices/SEO 100; speed about 85 on a local test.
- **Traffic.** Never click your own ads, never ask others to, never buy fake traffic. Some countries need the site to be some months old.
- **Ad placement rules.** No ads on screens without real content, no ads that look like buttons, no more ads than content, nothing covering the tool.

## Needed in the code when approved (not done yet, on purpose)
1. **Consent message (CMP) for the EEA, UK and Switzerland.** Google requires a Google-certified consent tool there. Turn on Google's free "Privacy & messaging" consent message in the AdSense account. The privacy page already promises this.
2. **Change the security rules in public/_headers.** They now block all outside scripts, so ads would not load. Roughly (copy the exact list from Google's AdSense CSP page when you do it):
   - script-src: add https://pagead2.googlesyndication.com, https://*.google.com, https://*.googlesyndication.com, https://*.doubleclick.net, https://*.adtrafficquality.google
   - frame-src: add https://googleads.g.doubleclick.net, https://*.googlesyndication.com, https://tpc.googlesyndication.com
   - img-src: add https:
   - connect-src: add https://*.google.com, https://*.googlesyndication.com, https://*.doubleclick.net
   - style-src: add 'unsafe-inline' (ads need it)
   Only add the rules on ad-showing pages if you can; the tools themselves should keep the strict rules.
3. **Load the ad script only when ads are on.** Add it in the AdSlot component, never when `ads.enabled` is false.
4. **ads.txt.** Put a file public/ads.txt with the line Google gives you (publisher ID). Without it earnings can be limited.
5. **Service worker.** Keep ad files out of the offline cache.
6. **Offline mode.** Ads cannot load offline; AdSlot must show nothing then.
7. **Then test again:** all pages at 320/768/1440, the layout shift (CLS) with ads, the tools still work, and the Privacy page text matches what really runs.

## Honest notes
- Approval is Google's decision. A tool-only site can be rejected for "low value content"; adding more real guides is the fix.
- Ads add cookies. After they are on, the "no cookies, no tracking" claims on other pages (home, Help, footer) must be changed to match.
- None of this is legal advice. Have a lawyer check Privacy and Terms, especially for India's data protection law and for visitors from Europe.
