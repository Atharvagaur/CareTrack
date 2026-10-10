import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl font-semibold text-slate-300">404</p>
      <h1 className="mt-3 text-xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
