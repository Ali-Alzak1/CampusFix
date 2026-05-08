import Badge from './Badge.jsx';

const TONE_BY_STATUS_ID = {
  1: 'neutral',  // Submitted
  2: 'info',     // Acknowledged
  3: 'accent',   // In Progress
  4: 'success',  // Resolved
  5: 'soft',     // Closed
  6: 'danger'    // Rejected
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const tone = TONE_BY_STATUS_ID[status.status_id] ?? 'neutral';
  return <Badge tone={tone}>{status.status_name}</Badge>;
}
