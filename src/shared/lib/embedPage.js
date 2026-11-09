// Embeds a page so it can be drawn on a new sheet. A page with no content at all (truly empty) gives { width, height, empty: true }.
export async function embedOrEmpty(output, page) {
  if (!page.node.Contents()) {
    const { width, height } = page.getSize();
    return { width, height, empty: true };
  }
  return (await output.embedPages([page]))[0];
}

// Draws an embedded page (or nothing, if it was empty) onto a sheet.
export function drawEmbedded(sheet, embedded, options) {
  if (!embedded.empty) sheet.drawPage(embedded, options);
}
