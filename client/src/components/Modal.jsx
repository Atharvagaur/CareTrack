import { useEffect } from 'react';
import { X } from 'lucide-react';

/** Reusable accessible modal used for the issue form and delete confirmation. */
export default function Modal({ title, onClose, children, footer, size = 'max-w-lg' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`my-8 w-full ${size} rounded-xl border border-slate-200 bg-white shadow-xl`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
