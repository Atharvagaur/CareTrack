/**
 * Issue domain constants for the API.
 * Values mirror the client's `src/constants/issues.js` so responses map
 * straight onto the existing UI metadata (lowercase keys + display labels).
 */

export const ISSUE_STATUSES = ['open', 'in_progress', 'blocked', 'resolved'];

export const ISSUE_STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  resolved: 'Resolved',
};

export const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const ISSUE_PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const ISSUE_CATEGORIES = [
  'Equipment',
  'Scheduling',
  'Billing',
  'Supply Chain',
  'Staffing',
  'IT Systems',
  'Facilities',
];
