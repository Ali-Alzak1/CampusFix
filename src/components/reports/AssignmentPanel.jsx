import EmptyState from '../ui/EmptyState.jsx';
import Badge from '../ui/Badge.jsx';
import { formatDateTime } from '../../utils/format.js';

export default function AssignmentPanel({ assignments }) {
  if (!assignments || assignments.length === 0) {
    return <EmptyState title="Not yet assigned" description="No maintenance staff have been assigned to this report." />;
  }

  return (
    <ul className="assignment-list">
      {assignments.map((a) => (
        <li key={a.assignment_id} className="assignment-item">
          <div className="assignment-head">
            <div>
              <p className="assignment-staff">{a.staff?.name}</p>
              <p className="text-small text-muted">{a.unit?.unit_name}</p>
            </div>
            {a.completed_at
              ? <Badge tone="success">Completed</Badge>
              : <Badge tone="info">In Progress</Badge>}
          </div>

          <dl className="assignment-meta">
            <div>
              <dt className="text-tiny">Assigned</dt>
              <dd className="text-small">{formatDateTime(a.assigned_at)}</dd>
            </div>
            <div>
              <dt className="text-tiny">Completed</dt>
              <dd className="text-small">
                {a.completed_at ? formatDateTime(a.completed_at) : '—'}
              </dd>
            </div>
          </dl>

          {a.resolution_notes && (
            <p className="assignment-notes">{a.resolution_notes}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
