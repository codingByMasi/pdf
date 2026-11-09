// Makes a picture's background see-through by colour: starts at the edges and clears pixels close to the chosen colour.
// data: canvas pixel data (changed in place). options: { colour: [r, g, b], tolerance (0-255), edgeOnly }.
export function removeColour(data, width, height, { colour, tolerance = 40, edgeOnly = true }) {
  const near = (i) => Math.hypot(data[i] - colour[0], data[i + 1] - colour[1], data[i + 2] - colour[2]) / 1.732;
  const soft = tolerance * 1.35;
  const clear = (i) => {
    const d = near(i);
    if (d <= tolerance) data[i + 3] = 0;
    else if (d < soft) data[i + 3] = Math.min(data[i + 3], Math.round(((d - tolerance) / (soft - tolerance)) * 255));
  };
  if (!edgeOnly) {
    for (let i = 0; i < data.length; i += 4) clear(i);
    return data;
  }
  const seen = new Uint8Array(width * height);
  const stack = [];
  const push = (p) => {
    if (!seen[p] && near(p * 4) <= tolerance) {
      seen[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < width; x += 1) { push(x); push((height - 1) * width + x); }
  for (let y = 0; y < height; y += 1) { push(y * width); push(y * width + width - 1); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    if (x > 0) push(p - 1);
    if (x < width - 1) push(p + 1);
    if (p >= width) push(p - width);
    if (p < width * (height - 1)) push(p + width);
  }
  for (let p = 0; p < seen.length; p += 1) {
    if (seen[p]) data[p * 4 + 3] = 0;
  }
  // soften the rim: pixels next to the cleared area that are nearly the background colour
  for (let p = 0; p < seen.length; p += 1) {
    if (seen[p]) continue;
    const x = p % width;
    const touches = (x > 0 && seen[p - 1]) || (x < width - 1 && seen[p + 1]) || (p >= width && seen[p - width]) || (p < width * (height - 1) && seen[p + width]);
    if (touches) clear(p * 4);
  }
  return data;
}
