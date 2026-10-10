import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading…', className = 'py-10' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
