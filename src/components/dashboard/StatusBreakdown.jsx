import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';

export default function StatusBreakdown() {
  const { data, loading } = useAsync(() => analyticsApi.reportsByStatus(), []);
  const max = data ? Math.max(1, ...data.map((d) => d.count)) : 1;

  return (
    <Card title="Reports by Status" subtitle="Current distribution across the lifecycle">
      {loading && <Spinner />}
      {!loading && data && (
        <ul className="bar-list">
          {data.map((row) => {
            const pct = (row.count / max) * 100;
            return (
              <li key={row.status_id} className="bar-row">
                <span className="bar-label">{row.status_name}</span>
                <div className="bar-track" aria-hidden="true">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-value num">{row.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
