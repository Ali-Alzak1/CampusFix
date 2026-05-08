import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Field from '../components/ui/Field.jsx';
import ReportSummary from '../components/reports/ReportSummary.jsx';
import StatusTimeline from '../components/reports/StatusTimeline.jsx';
import AssignmentPanel from '../components/reports/AssignmentPanel.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { reportsApi } from '../api/reportsApi.js';
import { lookupsApi } from '../api/lookupsApi.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isStaff } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({ status_id: '', note: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { data: report, loading } = useAsync(() => reportsApi.getById(id), [id, refreshKey]);
  const requiredUnitId = report?.category?.default_unit_id ?? null;
  const isAdmin = currentUser?.role === 'admin';
  const canHandleByUnit = isAdmin || (requiredUnitId !== null && currentUser?.unit_id === requiredUnitId);

  useEffect(() => {
    lookupsApi.getStatuses().then(setStatuses);
  }, []);

  useEffect(() => {
    if (!report) return;
    setForm((f) => ({ ...f, status_id: String(report.status_id) }));
  }, [report?.status_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!canHandleByUnit) {
      setError('You cannot update this report because it is assigned to another unit.');
      return;
    }
    if (!form.status_id || Number(form.status_id) === report.status_id) {
      setError('Select a different status.');
      return;
    }
    setSaving(true);
    try {
      await reportsApi.updateStatus(report.report_id, {
        status_id: Number(form.status_id),
        changed_by: currentUser.user_id,
        note: form.note
      });
      setForm((f) => ({ ...f, note: '' }));
      setRefreshKey((x) => x + 1);
      setSuccess('Status updated.');
    } catch (err) {
      setError(err.message ?? 'Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading report" />;

  if (!report) {
    return (
      <>
        <PageHeader eyebrow="Reports" title="Report not found" />
        <EmptyState
          title={`No report with ID #${id}`}
          description="It may have been removed or the link is incorrect."
          action={<Button onClick={() => navigate('/reports')}>Back to all reports</Button>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={<Link to="/reports" className="back-link">← All reports</Link>}
        title={`Report #${report.report_id}`}
        description="Full lifecycle: submission, status changes, and assigned work."
      />

      <ReportSummary report={report} />

      <div className="detail-grid">
        {isStaff && (
          <Card title="Update Status" subtitle="Staff can move reports through lifecycle states">
            <form className="status-update-form" onSubmit={handleStatusSubmit}>
              {!canHandleByUnit && (
                <div className="form-error-banner">
                  You cannot handle this report because it belongs to another maintenance unit.
                </div>
              )}
              {error && <div className="form-error-banner">{error}</div>}
              {success && <div className="form-success-banner">{success}</div>}
              <div className="status-update-row">
                <Field label="New status" htmlFor="status_id" required>
                  <select
                    id="status_id"
                    className="select"
                    value={form.status_id}
                    onChange={(e) => setForm((f) => ({ ...f, status_id: e.target.value }))}
                    disabled={!canHandleByUnit}
                  >
                    {statuses.map((s) => (
                      <option key={s.status_id} value={s.status_id}>
                        {s.status_name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Status note" htmlFor="status_note" hint="Optional context added to the timeline.">
                <textarea
                  id="status_note"
                  className="textarea"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Brief update about what changed..."
                  disabled={!canHandleByUnit}
                />
              </Field>
              <div className="status-update-actions">
                <Button type="submit" variant="primary" disabled={saving || !canHandleByUnit}>
                  {saving ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card title="Status History" subtitle="From submission to current state">
          <StatusTimeline logs={report.status_logs} />
        </Card>

        <Card title="Assignments" subtitle={`${report.assignments.length} total`}>
          <AssignmentPanel assignments={report.assignments} />
        </Card>
      </div>
    </>
  );
}
