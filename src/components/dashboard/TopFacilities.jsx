import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';
import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';

export default function TopFacilities() {
  const { data, loading } = useAsync(() => analyticsApi.reportsByFacility(6), []);
  const max = data ? Math.max(1, ...data.map((d) => d.total_reports)) : 1;

  return (
    <Card title="Top Facilities" subtitle="Most-reported facilities campus-wide">
      {loading && <Spinner />}
      {!loading && data && (
        <ul className="bar-list">
          {data.map((row) => {
            const pct = (row.total_reports / max) * 100;
            return (
              <li key={row.facility_id} className="bar-row">
                <span className="bar-label">
                  {row.name}
                  <span className="text-subtle text-small"> · {row.building_name}</span>
                </span>
                <div className="bar-track" aria-hidden="true">
                  <div className="bar-fill bar-fill--accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="bar-value num">{row.total_reports}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
