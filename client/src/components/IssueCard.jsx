import { CalendarClock } from 'lucide-react';
import PriorityBadge from './PriorityBadge.jsx';
import { ISSUE_STATUSES, STATUS_META } from '../constants/issues.js';
import { formatDate, getInitials } from '../utils/issueStats.js';

const SELECT_CLASS =
  'mt-3 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50';

/** Compact issue card used inside the kanban columns. */
export default function IssueCard({ issue, onStatusChange, updating = false }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-slate-800">{issue.title}</p>
        <PriorityBadge priority={issue.priority} />
      </div>

      <p className="mt-2 text-xs text-slate-500">{issue.category}</p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
            {getInitials(issue.assignee)}
          </span>
          <span className="truncate text-xs text-slate-600">
            {issue.assignee || 'Unassigned'}
          </span>
        </div>
        <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
          <CalendarClock className="h-3.5 w-3.5" />
          {formatDate(issue.updatedAt)}
        </span>
      </div>

      {onStatusChange && (
        <label className="mt-3 block">
          <span className="sr-only">Change status for {issue.title}</span>
          <select
            value={issue.status}
            disabled={updating}
            onChange={(event) => onStatusChange(issue, event.target.value)}
            className={SELECT_CLASS}
            aria-label={`Change status for ${issue.title}`}
          >
            {ISSUE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {updating && status === issue.status
                  ? 'Updating…'
                  : STATUS_META[status].label}
              </option>
            ))}
          </select>
        </label>
      )}
    </article>
  );
}
