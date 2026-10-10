import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-rose-100 bg-rose-50 px-4 py-8 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-rose-800">Could not load data</p>
        <p className="mt-1 text-sm text-rose-600">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
