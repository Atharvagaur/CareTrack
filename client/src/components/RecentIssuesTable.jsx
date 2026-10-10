import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import EmptyState from './EmptyState.jsx';
import { formatDate, getInitials } from '../utils/issueStats.js';

const AVATAR_TONES = [
  'bg-indigo-100 text-indigo-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

function avatarTone(name) {
  const text = typeof name === 'string' && name ? name : '?';
  const total = text.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_TONES[total % AVATAR_TONES.length];
}

export default function RecentIssuesTable({
  issues,
  emptyMessage,
  onEdit,
  onDelete,
  actionsDisabled = false,
}) {
  const showActions = Boolean(onEdit || onDelete);

  if (!issues.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 sm:px-6">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            {showActions && <th className="px-4 py-3 text-right sm:px-6">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {issues.map((issue) => (
            <tr key={issue.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3 sm:px-6">
                <p className="font-medium text-slate-800">{issue.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{issue.id}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{issue.category}</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={issue.priority} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarTone(
                      issue.assignee
                    )}`}
                  >
                    {getInitials(issue.assignee)}
                  </span>
                  <span className="whitespace-nowrap text-slate-600">
                    {issue.assignee || 'Unassigned'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={issue.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {formatDate(issue.updatedAt)}
              </td>
              {showActions && (
                <td className="px-4 py-3 text-right sm:px-6">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(issue)}
                        disabled={actionsDisabled}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
                        aria-label={`Edit ${issue.title}`}
                        title="Edit issue"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(issue)}
                        disabled={actionsDisabled}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                        aria-label={`Delete ${issue.title}`}
                        title="Delete issue"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
