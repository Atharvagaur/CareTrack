const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

export default function MetricCard({ label, value, icon: Icon, tone = 'indigo', hint }) {
  const toneClasses = TONES[tone] ?? TONES.indigo;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
