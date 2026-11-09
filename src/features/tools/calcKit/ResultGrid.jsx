// Row of result boxes: each has a small label and a big value.
export function ResultGrid({ items }) {
  return (
    <dl className="stat-grid" aria-live="polite">
      {items.map((item) => <div key={item.label} className="stat"><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
    </dl>
  );
}
