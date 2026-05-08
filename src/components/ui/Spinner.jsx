import './ui.css';

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="text-muted text-small">{label}</span>
    </div>
  );
}
