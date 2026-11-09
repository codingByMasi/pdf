// Shows a page picture with an SVG layer on top where lines, boxes, text and pictures are drawn and moved.
import { useRef, useState } from 'react';
import { boundsOf, makeBox, makeLine, makePath, moveWithin } from './overlayModel.js';
import { OverlayItem } from './OverlayItem.jsx';

const MIN_BOX = 0.006;

// mode: 'select' | 'pen' | 'box'. brush: { kind, color, width } where kind is highlight, redact, rect, ellipse or line.
export function PageOverlay({ zoom = 100, url, size, alt, items, mode, brush, selectedId, onSelect, onAdd, onReplace, onDragStart }) {
  const svgRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const drag = useRef(null);
  const height = size.height / size.width;

  const spot = (event) => {
    const box = svgRef.current.getBoundingClientRect();
    return [(event.clientX - box.left) / box.width, (event.clientY - box.top) / box.width];
  };

  function down(event) {
    if (event.button > 0) return;
    const [x, y] = spot(event);
    const target = event.target.closest?.('[data-item]');
    if (mode === 'select') {
      const item = target ? items.find((it) => String(it.id) === target.dataset.item) : null;
      onSelect(item ? item.id : null);
      if (!item) return;
      onDragStart();
      drag.current = { item, x, y };
    } else if (mode === 'pen') setDraft({ type: 'path', points: [[x, y]] });
    else setDraft({ type: 'box', x0: x, y0: y, x1: x, y1: y });
    svgRef.current.setPointerCapture(event.pointerId);
  }

  function move(event) {
    const [x, y] = spot(event);
    if (drag.current) {
      const { item, x: x0, y: y0 } = drag.current;
      onReplace(item.id, moveWithin(item, x - x0, y - y0, height));
    } else if (draft?.type === 'path') setDraft({ ...draft, points: [...draft.points, [x, y]] });
    else if (draft) setDraft({ ...draft, x1: x, y1: y });
  }

  function up() {
    drag.current = null;
    if (!draft) return;
    const d = draft;
    setDraft(null);
    if (d.type === 'path') {
      if (d.points.length > 1) onAdd(makePath(d.points, brush.color, brush.width));
      return;
    }
    const x = Math.min(d.x0, d.x1);
    const y = Math.min(d.y0, d.y1);
    const w = Math.abs(d.x1 - d.x0);
    const h = Math.abs(d.y1 - d.y0);
    if (brush.kind === 'line') {
      if (Math.hypot(w, h) > MIN_BOX) onAdd(makeLine(d.x0, d.y0, d.x1, d.y1, brush.color, brush.width));
    } else if (w > MIN_BOX && h > MIN_BOX) onAdd(makeBox(brush.kind === 'ellipse' ? 'ellipse' : 'rect', x, y, w, h, brushStyle(brush)));
  }

  const shown = draft?.type === 'path' ? [makePath(draft.points, brush.color, brush.width)] : [];
  if (draft?.type === 'box') {
    const w = Math.abs(draft.x1 - draft.x0);
    const h = Math.abs(draft.y1 - draft.y0);
    const x = Math.min(draft.x0, draft.x1);
    const y = Math.min(draft.y0, draft.y1);
    shown.push(brush.kind === 'line' ? makeLine(draft.x0, draft.y0, draft.x1, draft.y1, brush.color, brush.width) : makeBox(brush.kind === 'ellipse' ? 'ellipse' : 'rect', x, y, w, h, brushStyle(brush)));
  }
  const selected = items.find((item) => item.id === selectedId);
  const sel = selected ? boundsOf(selected) : null;

  return (
    <div className={`overlay-wrap overlay-${mode}`} style={{ ...(zoom > 100 ? { width: `${zoom}%` } : zoom < 100 ? { maxWidth: `${(40 * zoom) / 100}rem` } : {}), aspectRatio: `${size.width} / ${size.height}` }}>
      {url ? <img className="overlay-image" src={url} alt={alt} draggable="false" /> : null}
      <svg
        ref={svgRef}
        className="overlay-svg"
        viewBox={`0 0 1 ${height}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {items.map((item) => <OverlayItem key={item.id} item={item} />)}
        {shown.map((item, i) => <OverlayItem key={`draft${i}`} item={item} draft />)}
        {sel ? <rect className="overlay-selection" x={sel.x - 0.005} y={sel.y - 0.005} width={sel.w + 0.01} height={sel.h + 0.01} /> : null}
      </svg>
    </div>
  );
}

// Look of boxes: highlight (see-through colour), redact (solid black), rect and ellipse (outline).
export function brushStyle(brush) {
  if (brush.kind === 'highlight') return { fill: brush.color, opacity: 0.35, stroke: null, width: 0 };
  if (brush.kind === 'redact') return { fill: '#000000', opacity: 1, stroke: null, width: 0, redact: true };
  return { fill: null, opacity: 1, stroke: brush.color, width: brush.width };
}
