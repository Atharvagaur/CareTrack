import { PRIORITY_META } from '../constants/issues.js';

export default function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority];

  if (!meta) {
    return <span className="text-xs text-slate-400">Unknown</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.badgeClass}`}
    >
      {meta.label}
    </span>
  );
}
