# Testing
- Run `npm test`. Tests sit next to the code as `*.test.js`.
- Covered: i18n keys, file checks, friendly errors, size text, tool list, and search pages and sitemap (titles, descriptions, escaping, one entry per page), project rules (file size, first-line comment, import direction, file names).
- Not covered by tests: how screens look, real PDF work in real browsers. Test those by hand, especially on a phone.

## Browsers and screens
- Tested by script in Chromium only, at widths 320, 360, 768, 1024, 1440 and 2560 (all 8 tools at 320, 768 and 1440), in English and Hindi: no sideways scroll, all buttons at least 52px.
- NOT tested: Firefox, Safari (Mac, iPhone, iPad), Samsung Internet, real phones. Please test these by hand.
- Also tested in Chromium: the built site served like Cloudflare Pages (pretty addresses, real 404, the strict Content-Security-Policy). NOT tested: the real Cloudflare Pages site (nothing is deployed yet).
