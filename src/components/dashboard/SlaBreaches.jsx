import { Link } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Spinner from '../ui/Spinner.jsx';
import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { formatHours } from '../../utils/format.js';

export default function SlaBreaches() {
  const { data, loading } = useAsync(() => analyticsApi.slaBreaches(), []);

  return (
    <Card title="SLA Breaches" subtitle="Open reports past their deadline">
      {loading && <Spinner />}
      {!loading && data?.length === 0 && (
        <EmptyState title="All on time" description="No open reports have exceeded their SLA window." />
      )}
      {!loading && data?.length > 0 && (
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th className="num">Open for</th>
                <th className="num">SLA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.report_id}>
                  <td>
                    <Link className="table-link" to={`/reports/${row.report_id}`}>{row.title}</Link>
                    <p className="text-small text-muted">{row.facility}</p>
                  </td>
                  <td>{row.priority}</td>
                  <td className="num">{formatHours(row.hours_open)}</td>
                  <td className="num text-muted">{formatHours(row.sla_hours)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
