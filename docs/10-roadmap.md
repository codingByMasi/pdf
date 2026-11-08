# Roadmap: tools from the big-site menu

> **Superseded (2026-11-08).** The user's newer brief fixes the final list at 25 browser-only tools (see CLAUDE.md). Password tools, OCR and everything that needs a server are not built. This file is kept only as background and will be replaced by `docs/03-tools.md`.

Source: the menu screenshot the user shared ("I want all these").
Decision by the user: **no AI tools**. They are skipped (AI PDF Assistant, Chat with PDF, AI PDF Summarizer, Translate PDF, AI Question Generator).

Rules that decide the groups: everything runs in the browser, files never leave the device, no backend, and no library without a written reason.

Size guide: **S** = a few hours, **M** = about a day, **L** = several days or more.

## Already built (8)
Merge, Split, Rotate, Delete pages, Image to PDF, PDF to image, Watermark (with page numbers), Compress.
These also cover several menu names. We can give each its own page for search engines at very small cost (S each, all together about one day):
Extract PDF Pages (= Split by page range), Number Pages (= page numbers part), Organize PDF (= rotate, reorder and delete together), PDF to JPG, PDF to PNG, JPG to PDF, PDF Converter (a simple menu page).

## Group 1: easy in the browser (pdf-lib and pdf.js, nothing new)
| Tool | Size | Honest notes |
|---|---|---|
| Extract PDF Pages, Number Pages, Organize PDF, PDF to JPG/PNG, JPG to PDF, PDF Converter | S | Pages that reuse tools we already have. |
| Flatten PDF | S | Makes form fields part of the page. Works for forms. Other markings stay as they are. |
| Crop PDF | M | Needs a screen to draw the crop box on a page picture. |
| PDF Reader | M | Basic viewer: scroll, zoom, search. Not a full Acrobat. |
| TXT to PDF | S | English text is easy. Hindi text needs a font file (see group 2). |
| CSV to PDF | M | A simple table layout. Very wide tables get small. |
| PDF Scanner | M | Take photos with the phone camera, clean them (black and white), make a PDF. Camera needs the site on https. No automatic edge finding in the first version. |
| Form Filler | M | Lists the form fields of the PDF as simple boxes and fills them. Works only for PDFs that really have form fields. |
| Sign PDF (picture signature) | M | Draw, type or upload a signature and place it on a page. This is a visible signature, **not** a legal digital certificate. |
| Annotator (highlight, draw, notes) | L | Needs a drawing layer over page pictures. Touch and mouse both. |
| Edit PDF (add text, pictures, shapes) | L | We can **add** things on top. Changing the existing text of a PDF is not realistic in the browser. |
| Redact PDF | M | Honest way: the redacted page is turned into a picture with black boxes, so the hidden text is truly gone. The page then loses selectable text. |

## Group 2: possible, but needs a new library (each needs a written reason)
| Tool | Library idea | Size | Honest notes |
|---|---|---|---|
| Protect PDF (password) | A small encryption library, or qpdf compiled to WebAssembly (about 1 to 2 MB). pdf-lib cannot encrypt. | M | Reason: pdf-lib has no encryption. |
| Unlock PDF | qpdf WebAssembly (licence is Apache 2.0, fine for us). Mupdf is also possible but its licence (AGPL) is a problem. | M | Works only when the person knows the password. We do not break passwords. |
| OCR (make scanned PDFs searchable) | Tesseract.js (WebAssembly). | L | Language data is large (several MB per language, Hindi more) and we must host it ourselves to keep the privacy rule. Slow on phones. Accuracy on poor scans is limited. |
| Hindi in Watermark / TXT to PDF | fontkit plus a Hindi font file. | M | About 1 MB or more extra, loaded only on those tools. |
| ZIP to PDF | fflate (small unzip library). | S | Turns pictures or text files inside a zip into a PDF. |
| RTF to PDF | An RTF reader library. | M | Formatting will be rough. Plain text and simple styles only. |
| HTML to PDF | Either the browser's Print dialog (free, good quality, but the person must choose "Save as PDF") or an image-based library (text not selectable). | M | Honest: a perfect result needs a server browser, which we do not have. |
| EPUB to PDF | fflate plus our own layout. | L | Layout will be basic. Not recommended early. |

## Group 3: not possible without a server or a paid service
These break "no backend, files never leave the device", or cannot be done well in a browser.
| Tool | Why |
|---|---|
| PDF to Word, PDF to Excel, PDF to PPT | A PDF has no real paragraphs or tables, only placed letters. Rebuilding them well needs heavy server software. A browser-only "text only" version would be very rough. |
| Word, Excel, PPT to PDF | Needs Microsoft/LibreOffice layout rules. Only a rough browser version is possible (for example DOCX text through a converter library); fonts, tables and pictures will often break. |
| ODT, ODS, ODP to PDF, Pages to PDF | Same as above. LibreOffice can be compiled to WebAssembly, but it is over 100 MB to download and very fragile on phones. Not recommended. |
| PDF to PDF/A | Needs exact colour profiles, font embedding and a validator. A browser tool could not promise a valid PDF/A, so we should not claim it. |
| HWP to PDF | A Korean office format with no good browser tool. |
| Share PDF (link) | A link needs a place to store the file, which means a server. We can offer the phone's own Share button after download (no upload by us). |
| Request Signatures (Sign.com) | A third-party paid service and it needs accounts and a server. |

## Skipped by decision
All AI tools (AI Assistant, Chat with PDF, AI Summarizer, Translate PDF, AI Question Generator).

## Recommended order
1. **Quick wins (about 1 day):** the search pages that reuse existing tools (Extract, Number Pages, Organize, PDF to JPG/PNG, JPG to PDF, PDF Converter page).
2. **Easy tools (about 1 week):** Flatten, Crop, TXT to PDF, CSV to PDF, PDF Scanner, Form Filler.
3. **Signing and markup (1 to 2 weeks):** Sign PDF, Redact, PDF Reader, Annotator, Edit PDF (add only).
4. **Library tools (one at a time):** Protect and Unlock first (very popular), then Hindi fonts, ZIP to PDF, then OCR last (biggest and slowest).
5. **Group 3:** leave out for now. If wanted later, it needs a small server, which changes the "no backend" promise. That is the user's decision.

Each step would keep the same flow: build, test, push, build, test, then wait for "go".
