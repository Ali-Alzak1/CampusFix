import EmptyState from '../ui/EmptyState.jsx';
import { formatDateTime, formatRole } from '../../utils/format.js';

export default function StatusTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return <EmptyState title="No status changes yet" description="The report has not progressed beyond submission." />;
  }

  return (
    <ol className="timeline">
      {logs.map((log) => (
        <li key={log.log_id} className="timeline-item">
          <span className="timeline-dot" aria-hidden="true" />
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-status">
                {(log.old_status?.status_name ?? 'Initial')}
                <span className="timeline-arrow"> → </span>
                <strong>{log.new_status?.status_name}</strong>
              </span>
              <span className="text-small text-subtle">{formatDateTime(log.changed_at)}</span>
            </div>
            <p className="text-small text-muted">
              {log.changed_by_user?.name} · {formatRole(log.changed_by_user?.role)}
            </p>
            {log.note && <p className="timeline-note">{log.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
