import './ui.css';

export default function Field({ label, htmlFor, hint, error, required, children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="field-required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint text-subtle">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
