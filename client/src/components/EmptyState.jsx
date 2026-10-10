import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
      <Inbox className="h-6 w-6 text-slate-400" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
