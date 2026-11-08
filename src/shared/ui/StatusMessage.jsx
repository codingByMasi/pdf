// Shows an error or info message in plain words; screen readers announce it.
export function StatusMessage({ kind = 'error', title, children }) {
  return (
    <div className={`status-message status-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {title ? <strong className="status-title">{title}</strong> : null}
      <p>{children}</p>
    </div>
  );
}
