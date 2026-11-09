# Legal and licence rules

The rule from the owner: nothing we build or publish may be illegal.

## Done in the code
- Licences: every package and font that reaches the browser is permissive (MIT, Apache 2.0, 0BSD, Zlib, SIL OFL). No GPL, AGPL, LGPL or non-commercial code. `scripts/licences.js` writes `dist/licences.txt` at build time, `scripts/licences.test.js` fails if a blocked licence appears. The Licences page (/licences) lists the credits.
- Names and design: no text, logos or design from other sites. No other company's name or logo is used as ours. Product names (PDF, Word, Excel ...) are only used to say what a tool opens or makes. QR Code credit to DENSO WAVE is on the Licences page.
- QR codes: we wrote our own small encoder (src/shared/lib/qr), no library, so there is no extra licence.
- Privacy: no upload, no analytics, no cookies. The browser's own storage keeps only the dark/light choice and options like watermark text, on the visitor's device. A footer button removes them.
- Responsible-use notes sit under tools that could be misused (Edit, Annotate, Form Filler, Sign, Stamp, Redact, Find and Replace, Photo Sheet, headers, watermark, QR, PDF info). Terms section 6 forbids forgery and misuse.
- Honest claims: signatures are pictures, not certified or digital signatures. Redact burns black boxes into a picture of the page but we do not claim it meets any legal standard. No PDF/A or compliance claim. Find and Replace says the old word stays hidden inside the file.

## Needs a lawyer before launch (not done by us)
- Privacy and Terms wording, and the "no cookies" statement, for India (Digital Personal Data Protection Act 2023, IT Act 2000) and for visitors from other countries (for example GDPR if the site is visible in the EU).
- Disclaimer and limit-of-liability wording; who is the legal owner or operator of the site, and the contact address required by Indian rules.
- Whether the Terms can forbid misuse in the way written, and how to handle takedown or abuse reports.
- If adverts are ever switched on: cookie consent, ad-network terms.
- Document makers (invoice, resume, letters): whether an invoice maker needs a GST disclaimer. Do not add government-style layouts.
