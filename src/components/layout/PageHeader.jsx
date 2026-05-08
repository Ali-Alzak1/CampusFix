export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {eyebrow && <p className="text-tiny">{eyebrow}</p>}
        <h1 className="page-header-title">{title}</h1>
        {description && (
          <p className="page-header-desc text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}
