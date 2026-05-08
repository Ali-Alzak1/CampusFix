import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { formatHours } from '../../utils/format.js';

export default function ResolutionVsSla() {
  const { data, loading } = useAsync(() => analyticsApi.resolutionVsSla(), []);

  return (
    <Card title="Resolution Time vs SLA" subtitle="Average actual time to close, by priority">
      {loading && <Spinner />}
      {!loading && data && (
        <div className="table-wrap" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Priority</th>
                <th className="num">SLA</th>
                <th className="num">Avg Actual</th>
                <th className="num">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const breached =
                  row.avg_resolution_hours != null &&
                  row.avg_resolution_hours > row.sla_hours;
                return (
                  <tr key={row.priority_id}>
                    <td>{row.level_name}</td>
                    <td className="num text-muted">{formatHours(row.sla_hours)}</td>
                    <td className={`num ${breached ? 'is-breach' : ''}`}>
                      {row.avg_resolution_hours == null
                        ? '—'
                        : formatHours(row.avg_resolution_hours)}
                    </td>
                    <td className="num text-muted">{row.resolved_reports}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
