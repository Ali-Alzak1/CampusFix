import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import StaffWorkloadTable from '../components/staff/StaffWorkloadTable.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { analyticsApi } from '../api/analyticsApi.js';

export default function StaffPage() {
  const { data: workload, loading } = useAsync(() => analyticsApi.staffWorkload(), []);

  return (
    <>
      <PageHeader
        eyebrow="Staff"
        title="Maintenance Workload"
        description="Open vs completed assignments per staff member, ordered by total load."
      />

      <Card>
        {loading ? <Spinner label="Loading workload" /> : <StaffWorkloadTable workload={workload} />}
      </Card>
    </>
  );
}
