/**
 * Shared issue domain constants: statuses, priorities and categories.
 * Badge classes are Tailwind; chart colors are plain hex for Recharts.
 */

export const ISSUE_STATUSES = ['open', 'in_progress', 'blocked', 'resolved'];

export const STATUS_META = {
  open: {
    label: 'Open',
    badgeClass: 'bg-amber-50 text-amber-700 ring-amber-200',
    chartColor: '#f59e0b',
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-700 ring-blue-200',
    chartColor: '#2563eb',
  },
  blocked: {
    label: 'Blocked',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-200',
    chartColor: '#e11d48',
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    chartColor: '#059669',
  },
};

export const ISSUE_PRIORITIES = ['critical', 'high', 'medium', 'low'];

export const PRIORITY_META = {
  critical: { label: 'Critical', badgeClass: 'bg-rose-100 text-rose-800 ring-rose-200' },
  high: { label: 'High', badgeClass: 'bg-orange-50 text-orange-700 ring-orange-200' },
  medium: { label: 'Medium', badgeClass: 'bg-sky-50 text-sky-700 ring-sky-200' },
  low: { label: 'Low', badgeClass: 'bg-slate-100 text-slate-600 ring-slate-200' },
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
