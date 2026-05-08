import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ReportsTable from '../components/reports/ReportsTable.jsx';
import ReportFilters, { EMPTY_FILTERS } from '../components/reports/ReportFilters.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { reportsApi } from '../api/reportsApi.js';

/**
 * Lists every report with client-side filtering. The filtering is intentionally
 * done in-memory here because the dataset is small and this mirrors how a
 * real backend `GET /reports?status=...` would behave from the page's POV.
 */
export default function ReportsPage() {
  const { data: reports, loading } = useAsync(() => reportsApi.list(), []);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    if (!reports) return [];
    return reports.filter((r) => matches(r, filters));
  }, [reports, filters]);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="All Maintenance Reports"
        description="Filter by status, priority, facility, or category. Click any row for full history."
        actions={
          <Link to="/reports/new">
            <Button variant="primary">+ New Report</Button>
          </Link>
        }
      />

      <ReportFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      <p className="text-small text-muted result-count">
        {loading ? 'Loading…' : `${filtered.length} of ${reports?.length ?? 0} reports`}
      </p>

      {loading ? <Spinner label="Loading reports" /> : <ReportsTable reports={filtered} />}
    </>
  );
}

function matches(r, f) {
  if (f.status_id   && r.status_id   !== Number(f.status_id))   return false;
  if (f.priority_id && r.priority_id !== Number(f.priority_id)) return false;
  if (f.category_id && r.category_id !== Number(f.category_id)) return false;
  if (f.facility_id && r.facility_id !== Number(f.facility_id)) return false;
  if (f.open_only   && r.resolved_at) return false;
  if (f.search) {
    const q = f.search.toLowerCase();
    const hay = `${r.title} ${r.description ?? ''} ${r.facility?.name ?? ''} ${r.submitter?.name ?? ''}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}
