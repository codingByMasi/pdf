// Works out which pages go on which side of each sheet so a printed, folded stack reads as a booklet.
// Returns sides: [[left, right], ...] with page numbers starting at 0, or null for a blank. Front and back of a sheet are consecutive.
export function bookletSides(pageCount) {
  const total = Math.ceil(pageCount / 4) * 4;
  const page = (n) => (n < pageCount ? n : null);
  const sides = [];
  for (let sheet = 0; sheet < total / 4; sheet += 1) {
    sides.push([page(total - 1 - 2 * sheet), page(2 * sheet)]);
    sides.push([page(2 * sheet + 1), page(total - 2 - 2 * sheet)]);
  }
  return sides;
}
