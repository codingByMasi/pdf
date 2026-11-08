// Shows an error or info message in plain words with a round icon; screen readers announce it.
export function StatusMessage({ kind = 'error', title, children }) {
  return (
    <div className={`status-message status-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="status-icon" aria-hidden="true">{kind === 'error' ? '!' : 'i'}</span>
      <div>
        {title ? <strong className="status-title">{title}</strong> : null}
        <p>{children}</p>
      </div>
    </div>
  );
}
