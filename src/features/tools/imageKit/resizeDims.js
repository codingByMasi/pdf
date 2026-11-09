// Works out the new size of a picture: by percent, by one side (keeping the shape), or both sides exactly.
// Returns { width, height } in whole pixels (at least 1).
export function resizeDims(width, height, { mode, percent = 100, newWidth = 0, newHeight = 0 }) {
  let w = width;
  let h = height;
  if (mode === 'percent') {
    w = (width * percent) / 100;
    h = (height * percent) / 100;
  } else if (mode === 'width' && newWidth > 0) {
    w = newWidth;
    h = (height * newWidth) / width;
  } else if (mode === 'height' && newHeight > 0) {
    h = newHeight;
    w = (width * newHeight) / height;
  } else if (mode === 'exact' && newWidth > 0 && newHeight > 0) {
    w = newWidth;
    h = newHeight;
  }
  return { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(h)) };
}
