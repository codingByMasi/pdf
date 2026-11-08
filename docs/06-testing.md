# Testing
- Run `npm test`. Tests sit next to the code as `*.test.js`.
- Covered: i18n keys, file checks, friendly errors, size text, tool list, and project rules (file size, first-line comment, import direction, file names).
- Not covered by tests: how screens look, real PDF work in real browsers. Test those by hand, especially on a phone.

## Browsers and screens
- Tested by hand-script in Chromium only, at widths 320, 360, 768, 1024, 1440 and 2560, in English and Hindi: no sideways scroll, all buttons at least 52px.
- NOT tested: Firefox, Safari (Mac, iPhone, iPad), Samsung Internet, real phones. Please test these by hand.
