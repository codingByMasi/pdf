// Turns picture pixels grey, or pure black and white when a threshold is given. Works on canvas pixel data in place.
export function grayInPlace(data, threshold = null) {
  for (let i = 0; i < data.length; i += 4) {
    const value = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    const out = threshold === null ? value : value < threshold ? 0 : 255;
    data[i] = out;
    data[i + 1] = out;
    data[i + 2] = out;
  }
  return data;
}
