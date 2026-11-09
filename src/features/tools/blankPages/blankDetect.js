// Decides whether a page picture is blank: nearly all pixels are white (or very light).
export const SENSITIVITY = { careful: 0.0003, normal: 0.002, loose: 0.01 };

export function isBlankPixels(data, sensitivity = 'normal') {
  const limit = SENSITIVITY[sensitivity] ?? SENSITIVITY.normal;
  const pixels = data.length / 4;
  let dark = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] < 225) dark += 1;
  }
  return dark / pixels <= limit;
}
