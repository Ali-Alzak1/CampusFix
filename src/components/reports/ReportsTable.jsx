import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge.jsx';
import PriorityBadge from '../ui/PriorityBadge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { formatDateTime } from '../../utils/format.js';

export default function ReportsTable({ reports }) {
  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        title="No reports match"
        description="Try clearing filters or submit a new report."
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Facility</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.report_id}>
              <td className="num text-muted">#{r.report_id}</td>
              <td>
                <Link className="table-link" to={`/reports/${r.report_id}`}>
                  {r.title}
                </Link>
                <p className="text-small text-subtle">
                  {r.submitter?.name}
                </p>
              </td>
              <td>
                {r.facility?.name}
                <p className="text-small text-subtle">{r.facility?.building_name}</p>
              </td>
              <td>{r.category?.category_name}</td>
              <td><PriorityBadge priority={r.priority} /></td>
              <td><StatusBadge status={r.status} /></td>
              <td className="text-small text-muted">{formatDateTime(r.submitted_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
