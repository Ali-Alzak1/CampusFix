/** Compact display: "20 Apr, 11:00" */
export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/** Date only: "20 Apr 2026" */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/** "3h ago" / "2d ago" relative to now. */
export function timeAgo(iso) {
  if (!iso) return '—';
  const ms = Date.now() - new Date(iso.replace(' ', 'T')).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Hours -> "4h" or "2d 4h" for SLA / duration display. */
export function formatHours(h) {
  if (h == null) return '—';
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  const r = h % 24;
  return r === 0 ? `${d}d` : `${d}d ${r}h`;
}

/** Display-friendly role label. */
export function formatRole(role) {
  if (!role) return '';
  return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
