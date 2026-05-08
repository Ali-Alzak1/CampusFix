import Badge from './Badge.jsx';

const TONE_BY_RANK = {
  1: 'danger',  // Critical
  2: 'warning', // High (uses accent yellow)
  3: 'neutral', // Medium
  4: 'soft',    // Low
  5: 'soft'     // Trivial
};

export default function PriorityBadge({ priority }) {
  if (!priority) return null;
  const tone = TONE_BY_RANK[priority.rank] ?? 'neutral';
  return <Badge tone={tone}>{priority.level_name}</Badge>;
}
