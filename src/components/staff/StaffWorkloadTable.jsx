import EmptyState from '../ui/EmptyState.jsx';
import './staff.css';

/**
 * Pure presentational. Receives the workload array from analyticsApi.staffWorkload(),
 * which is already sorted by total descending.
 */
export default function StaffWorkloadTable({ workload }) {
  if (!workload || workload.length === 0) {
    return <EmptyState title="No staff data" description="No maintenance staff have been assigned reports yet." />;
  }

  const max = Math.max(...workload.map((w) => w.total));

  return (
    <div className="table-wrap">
      <table className="table staff-table">
        <thead>
          <tr>
            <th>Staff Member</th>
            <th>Unit</th>
            <th className="num">Open</th>
            <th className="num">Completed</th>
            <th className="num">Total</th>
            <th>Load</th>
          </tr>
        </thead>
        <tbody>
          {workload.map((w) => (
            <tr key={w.user_id}>
              <td>
                <div>{w.name}</div>
                <p className="text-small text-subtle">{w.email}</p>
              </td>
              <td className="text-small">{w.unit_name ?? '—'}</td>
              <td className="num">{w.open}</td>
              <td className="num">{w.completed}</td>
              <td className="num"><strong>{w.total}</strong></td>
              <td className="staff-bar-cell">
                <div className="staff-bar-track">
                  <div
                    className="staff-bar-fill"
                    style={{ width: `${(w.total / max) * 100}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
