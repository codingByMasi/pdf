// Draws one placed thing (line, box, ellipse, text or picture) inside the page's SVG layer.
export function OverlayItem({ item, draft = false }) {
  const common = { 'data-item': draft ? undefined : item.id, className: draft ? 'overlay-draft' : 'overlay-item' };
  switch (item.type) {
    case 'path':
      return (
        <polyline {...common} points={item.points.map((p) => p.join(',')).join(' ')} fill="none" stroke={item.color}
          strokeWidth={item.width} strokeLinecap="round" strokeLinejoin="round" />
      );
    case 'line':
      return <line {...common} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} stroke={item.color} strokeWidth={item.width} strokeLinecap="round" />;
    case 'rect':
      return (
        <rect {...common} x={item.x} y={item.y} width={item.w} height={item.h} fill={item.fill ?? 'transparent'}
          fillOpacity={item.fill ? item.opacity : 1} stroke={item.stroke ?? 'none'} strokeWidth={item.width} />
      );
    case 'ellipse':
      return (
        <ellipse {...common} cx={item.x + item.w / 2} cy={item.y + item.h / 2} rx={item.w / 2} ry={item.h / 2}
          fill={item.fill ?? 'transparent'} fillOpacity={item.fill ? item.opacity : 1} stroke={item.stroke ?? 'none'} strokeWidth={item.width} />
      );
    case 'text':
      return (
        <text {...common} x={item.x} y={item.y + item.size} fontSize={item.size} fill={item.color} fontFamily="'Noto Sans', 'Segoe UI', sans-serif">
          {item.text.split('\n').map((line, i) => (
            <tspan key={i} x={item.x} dy={i === 0 ? 0 : item.size * 1.3}>{line || ' '}</tspan>
          ))}
        </text>
      );
    case 'field':
      return (
        <g {...common}>
          <rect x={item.x} y={item.y} width={item.w} height={item.h} fill="rgba(26, 86, 219, 0.12)" stroke="#1a56db" strokeWidth="0.003" strokeDasharray="0.01 0.006" />
          {item.fieldKind === 'check' ? <path d={`M ${item.x + item.w * 0.2} ${item.y + item.h * 0.55} l ${item.w * 0.2} ${item.h * 0.25} l ${item.w * 0.4} ${-item.h * 0.5}`} fill="none" stroke="#1a56db" strokeWidth="0.004" /> : null}
          {item.fieldKind === 'dropdown' ? <path d={`M ${item.x + item.w - 0.035} ${item.y + item.h * 0.4} l 0.012 ${item.h * 0.25} l 0.012 ${-item.h * 0.25} z`} fill="#1a56db" /> : null}
          {item.name && item.fieldKind !== 'check' ? <text x={item.x + 0.008} y={item.y + item.h * 0.68} fontSize={item.h * 0.5} fill="#1a56db">{item.name}</text> : null}
        </g>
      );
    case 'image':
      return <image {...common} href={item.url} x={item.x} y={item.y} width={item.w} height={item.h} preserveAspectRatio="none" />;
    default:
      return null;
  }
}
