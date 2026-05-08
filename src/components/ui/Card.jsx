import './ui.css';

export default function Card({
  title,
  subtitle,
  action,
  padding = 'md',
  className = '',
  children
}) {
  return (
    <section className={`card card--pad-${padding} ${className}`.trim()}>
      {(title || action) && (
        <header className="card-header">
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle text-muted">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}
