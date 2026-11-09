// Shows a picture and lets a person drag boxes on it (mouse or finger). Boxes are kept as shares of the picture: { x, y, w, h } from 0 to 1.
import { useRef, useState } from 'react';

const MIN = 0.01;

// single: only one box. aspect: width / height in pixels to hold the box to (needs imageWidth and imageHeight).
export function RegionPicker({ url, alt, rects, onChange, single = false, aspect = null, imageWidth = 1, imageHeight = 1 }) {
  const box = useRef(null);
  const start = useRef(null);
  const [draft, setDraft] = useState(null);

  const spot = (event) => {
    const r = box.current.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (event.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (event.clientY - r.top) / r.height))];
  };
  const shape = (a, b) => {
    let w = Math.abs(b[0] - a[0]);
    let h = Math.abs(b[1] - a[1]);
    if (aspect) h = (w * imageWidth) / (aspect * imageHeight);
    const x = b[0] < a[0] ? a[0] - w : a[0];
    const y = b[1] < a[1] ? a[1] - h : a[1];
    if (y < 0 || y + h > 1) {
      h = Math.min(h, b[1] < a[1] ? a[1] : 1 - a[1]);
      if (aspect) w = (h * aspect * imageHeight) / imageWidth;
    }
    return { x: b[0] < a[0] ? a[0] - w : a[0], y: b[1] < a[1] ? a[1] - h : a[1], w, h };
  };

  function down(event) {
    if (event.button > 0) return;
    start.current = spot(event);
    box.current.setPointerCapture(event.pointerId);
    setDraft(null);
  }
  function move(event) {
    if (start.current) setDraft(shape(start.current, spot(event)));
  }
  function up() {
    if (!start.current) return;
    const made = draft;
    start.current = null;
    setDraft(null);
    if (made && made.w > MIN && made.h > MIN) onChange(single ? [made] : [...rects, made]);
  }

  const shown = draft ? [...(single ? [] : rects), draft] : rects;
  return (
    <div ref={box} className="region-wrap" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <img src={url} alt={alt} draggable="false" />
      {shown.map((r, i) => (
        <span key={i} className="region-box" style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%` }} />
      ))}
    </div>
  );
}
