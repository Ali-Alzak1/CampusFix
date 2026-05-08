import './ui.css';

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="empty">
      <h4 className="empty-title">{title}</h4>
      {description && <p className="empty-desc text-muted">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
