import { ISSUE_STATUSES, STATUS_META } from '../constants/issues.js';

/** Counts per status plus the total, used by metric cards and the board. */
export function getIssueMetrics(issues) {
  const metrics = { total: issues.length, open: 0, in_progress: 0, blocked: 0, resolved: 0 };

  for (const issue of issues) {
    if (issue.status in metrics) {
      metrics[issue.status] += 1;
    }
  }

  return metrics;
}

/** Status distribution shaped for the Recharts pie chart. */
export function getStatusDistribution(issues) {
  const metrics = getIssueMetrics(issues);

  return ISSUE_STATUSES.map((status) => ({
    status,
    name: STATUS_META[status].label,
    value: metrics[status],
    color: STATUS_META[status].chartColor,
  }));
}

/** Groups issues by status while preserving STATUS_META column order. */
export function groupIssuesByStatus(issues) {
  return ISSUE_STATUSES.map((status) => ({
    status,
    label: STATUS_META[status].label,
    badgeClass: STATUS_META[status].badgeClass,
    issues: issues.filter((issue) => issue.status === status),
  }));
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getInitials(name) {
  if (typeof name !== 'string' || !name.trim()) return '?';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
