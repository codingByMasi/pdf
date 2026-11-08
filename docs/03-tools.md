# Tools list

The final list is 25 browser-only tools (see CLAUDE.md). The one list in code is `src/shared/lib/toolCatalog.js`. A tool only appears on the site when it is in that list and has a screen in `src/features/tools/toolRegistry.js` (a test checks both match).

Legend: built = works now. Planned steps: (b) Organize, (c) Convert and PDF to Image, (d) Edit, Sign, Flatten, (e) Compress and Scanner, (f) SEO and deploy checks.

| # | Tool | Category | Status | Folder |
|---|---|---|---|---|
| 1 | Merge PDF | Organize | built | merge |
| 2 | Split PDF | Organize | built | split |
| 3 | Rotate PDF | Organize | built | rotate |
| 4 | Delete PDF Pages | Organize | built | delete |
| 5 | Extract PDF Pages | Organize | built | extract |
| 6 | Organize PDF | Organize | built | organize |
| 7 | Number Pages | Edit | step d (works today inside Watermark) | |
| 8 | Crop PDF | Edit | step d | |
| 9 | Watermark PDF | Edit | built (English letters only until the Hindi font is added) | watermark |
| 10 | Redact PDF | Edit | step d | |
| 11 | PDF Reader | Edit | step d | |
| 12 | PDF Annotator | Edit | step d | |
| 13 | PDF Form Filler | Edit | step d | |
| 14 | Edit PDF (add on top only) | Edit | step d | |
| 15 | Sign PDF | Fill & Sign | step d | |
| 16 | JPG to PDF (also PNG) | Convert to PDF | built | jpgToPdf |
| 17 | TXT to PDF | Convert to PDF | step c | |
| 18 | CSV to PDF | Convert to PDF | step c | |
| 19 | HTML to PDF (simple pages) | Convert to PDF | step c | |
| 20 | ZIP to PDF | Convert to PDF | step c | |
| 21 | PDF to JPG | PDF to Image | built | pdfToJpg (uses pdfToImage) |
| 22 | PDF to PNG | PDF to Image | built | pdfToPng (uses pdfToImage) |
| 23 | Flatten PDF | Protect | step d | |
| 24 | Compress PDF | Compress | built (basic) | compress |
| 25 | PDF Scanner | Scan | step e | |

Not built, on purpose (need a server or a paid service): PDF to Word/Excel/PPT, Word/Excel/PPT to PDF, ODT/ODS/ODP/RTF/HWP/EPUB/Pages to PDF, OCR, PDF/A, AI tools, Translate, password Unlock/Protect, Request Signatures, Share PDF.

## Screens
- Home: tools grouped by category, a search box (matches name and description in the chosen language), "Your files never leave your device."
- Tool page: title, working area (drop-zone, file list, options, messages, progress, download), 3-step guide, questions and answers.
- Privacy, Terms, Contact (footer links), and the 404 page.

## Known weaker points (be honest with users)
- Compress only shrinks JPG pictures; text-only PDFs barely change.
- Watermark text is English letters, numbers and simple signs until the Hindi font is added (step d).
- Very large PDFs may still be slow or fail on older phones, even with the worker.
