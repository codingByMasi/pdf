// Draws Markdown blocks as safe page elements (built piece by piece, never from raw HTML).
function Runs({ runs }) {
  return runs.map((run, i) => (run.bold ? <strong key={i}>{run.text}</strong> : <span key={i}>{run.text}</span>));
}

export function MarkdownView({ blocks }) {
  return (
    <div className="md-view">
      {blocks.map((block, i) => {
        if (block.kind === 'heading') {
          const Tag = `h${Math.min(6, block.level + 2)}`;
          return <Tag key={i}><Runs runs={block.runs} /></Tag>;
        }
        if (block.kind === 'item') return <p key={i} className="md-item" style={{ marginInlineStart: `${block.depth * 1.2}rem` }}><span aria-hidden="true">{block.marker} </span><Runs runs={block.runs} /></p>;
        if (block.kind === 'pre') return <pre key={i}>{block.text}</pre>;
        if (block.kind === 'rule') return <hr key={i} />;
        if (block.kind === 'table') {
          const [head, ...rows] = block.rows;
          return (
            <div key={i} className="md-table"><table>
              <thead><tr>{head.map((c, j) => <th key={j}>{c}</th>)}</tr></thead>
              <tbody>{rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
            </table></div>
          );
        }
        return block.quote ? <blockquote key={i}><Runs runs={block.runs} /></blockquote> : <p key={i}><Runs runs={block.runs} /></p>;
      })}
    </div>
  );
}
