export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = 'p-4 sm:p-6',
}) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
