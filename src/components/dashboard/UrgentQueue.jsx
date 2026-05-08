import { Link } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Spinner from '../ui/Spinner.jsx';
import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { timeAgo } from '../../utils/format.js';

const TONE = { 1: 'danger', 2: 'warning' };

export default function UrgentQueue() {
  const { data, loading } = useAsync(() => analyticsApi.urgentQueue(), []);

  return (
    <Card title="Urgent Queue" subtitle="Open reports at Critical or High priority">
      {loading && <Spinner />}
      {!loading && data?.length === 0 && (
        <EmptyState title="Queue is clear" description="No critical or high-priority reports are open right now." />
      )}
      {!loading && data?.length > 0 && (
        <ul className="urgent-list">
          {data.map((row) => (
            <li key={row.report_id} className="urgent-row">
              <div className="urgent-row-main">
                <div className="urgent-row-meta">
                  <Badge tone={TONE[row.rank] ?? 'neutral'}>{row.priority}</Badge>
                  <span className="text-tiny">{row.status}</span>
                </div>
                <Link to={`/reports/${row.report_id}`} className="urgent-row-title">
                  {row.title}
                </Link>
                <p className="text-small text-muted">
                  {row.facility} · {row.submitter}
                </p>
              </div>
              <span className="text-small text-subtle">{timeAgo(row.submitted_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
