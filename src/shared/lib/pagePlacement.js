// Turns a spot on the page as you see it into a spot in the PDF file, even when the page is turned.
export function displaySize(width, height, rotation) {
  return rotation % 180 === 0 ? { width, height } : { width: height, height: width };
}

// width/height are the page's own (unturned) size. rotation is 0, 90, 180 or 270.
export function displayToPage(point, { width, height, rotation }) {
  switch (rotation) {
    case 90: return { x: width - point.y, y: point.x };
    case 180: return { x: width - point.x, y: height - point.y };
    case 270: return { x: point.y, y: height - point.x };
    default: return { x: point.x, y: point.y };
  }
}
