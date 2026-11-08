// Works out a page's visible box, turn and size, and maps spots on the page as you see it into the PDF file.
import { displaySize, displayToPage } from './pagePlacement.js';

export function pageGeometry(page) {
  const box = page.getCropBox();
  const rotation = ((page.getRotation().angle % 360) + 360) % 360;
  const shown = displaySize(box.width, box.height, rotation);
  const toPage = (point) => {
    const spot = displayToPage(point, { width: box.width, height: box.height, rotation });
    return { x: spot.x + box.x, y: spot.y + box.y };
  };
  return { box, rotation, shown, toPage };
}
