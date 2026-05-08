import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import NewReportForm from '../components/reports/NewReportForm.jsx';
import { reportsApi } from '../api/reportsApi.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function NewReportPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await reportsApi.create(form);
      navigate(`/reports/${created.report_id}`);
    } catch (err) {
      setSubmitError(err.message ?? 'Could not submit the report.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={<Link to="/reports" className="back-link">← All reports</Link>}
        title="Submit a New Report"
        description="Provide the facility, category, and a clear description so the right unit can be dispatched."
      />

      <Card>
        {submitError && <div className="form-error-banner">{submitError}</div>}
        <NewReportForm onSubmit={handleSubmit} submitting={submitting} currentUser={currentUser} />
      </Card>
    </>
  );
}
