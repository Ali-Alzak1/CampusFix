import { analyticsApi } from '../../api/analyticsApi.js';
import { useAsync } from '../../hooks/useAsync.js';
import StatCard from './StatCard.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function SummaryStrip() {
  const { data, loading } = useAsync(() => analyticsApi.summary(), []);
  if (loading || !data) return <Spinner />;
  return (
    <div className="stat-grid">
      <StatCard label="Total Reports"        value={data.total}             hint="All time" />
      <StatCard label="Open"                 value={data.open}              hint="Awaiting resolution" tone="primary" />
      <StatCard label="Resolved · Last 7 Days" value={data.resolvedThisWeek} hint="Closed within window" />
      <StatCard label="SLA Breaches"         value={data.breachCount}       hint="Open past deadline"   tone="danger" />
    </div>
  );
}
