import StatusBadge from '../ui/StatusBadge.jsx';
import PriorityBadge from '../ui/PriorityBadge.jsx';
import { formatDateTime, formatRole } from '../../utils/format.js';

export default function ReportSummary({ report }) {
  return (
    <div className="report-summary">
      <div className="report-summary-meta">
        <span className="text-tiny">Report #{report.report_id}</span>
        <PriorityBadge priority={report.priority} />
        <StatusBadge status={report.status} />
      </div>

      <h2 className="report-summary-title">{report.title}</h2>
      {report.description && (
        <p className="report-summary-desc text-muted">{report.description}</p>
      )}

      <dl className="report-summary-grid">
        <Item label="Submitter">
          {report.submitter?.name}
          <span className="text-subtle text-small"> · {formatRole(report.submitter?.role)}</span>
        </Item>
        <Item label="Facility">
          {report.facility?.name}
          <span className="text-subtle text-small"> · {report.facility?.building_name}</span>
        </Item>
        <Item label="Area">{report.facility?.area_description ?? '—'}</Item>
        <Item label="Category">{report.category?.category_name}</Item>
        <Item label="Submitted">{formatDateTime(report.submitted_at)}</Item>
        <Item label="Last Updated">{formatDateTime(report.updated_at)}</Item>
        <Item label="Resolved">
          {report.resolved_at ? formatDateTime(report.resolved_at) : 'Not yet resolved'}
        </Item>
        <Item label="SLA">{report.priority?.sla_hours}h</Item>
      </dl>
    </div>
  );
}

function Item({ label, children }) {
  return (
    <div className="report-summary-item">
      <dt className="text-tiny">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
