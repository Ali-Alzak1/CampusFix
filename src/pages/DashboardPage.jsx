import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import SummaryStrip from '../components/dashboard/SummaryStrip.jsx';
import UrgentQueue from '../components/dashboard/UrgentQueue.jsx';
import SlaBreaches from '../components/dashboard/SlaBreaches.jsx';
import StatusBreakdown from '../components/dashboard/StatusBreakdown.jsx';
import TopFacilities from '../components/dashboard/TopFacilities.jsx';
import ResolutionVsSla from '../components/dashboard/ResolutionVsSla.jsx';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Facilities Dashboard"
        description="A live snapshot of campus reports, response times, and current workload."
        actions={
          <Link to="/reports/new">
            <Button variant="primary">+ New Report</Button>
          </Link>
        }
      />

      <SummaryStrip />

      <div className="dashboard-grid">
        <UrgentQueue />
        <StatusBreakdown />
        <TopFacilities />
        <ResolutionVsSla />
        <div className="span-2"><SlaBreaches /></div>
      </div>
    </>
  );
}
