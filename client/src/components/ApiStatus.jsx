import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchHealth } from '../api/health.js';

/**
 * Small indicator that pings GET /api/health so the frontend can show whether
 * the backend is reachable. Loading, online and offline states are covered.
 */
export default function ApiStatus() {
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then(() => !cancelled && setState('online'))
      .catch(() => !cancelled && setState('offline'));

    return () => {
      cancelled = true;
    };
  }, []);

  const styles = {
    loading: { dot: 'bg-slate-300', text: 'Checking API…' },
    online: { dot: 'bg-emerald-500', text: 'API online' },
    offline: { dot: 'bg-rose-500', text: 'API offline' },
  }[state];

  return (
    <span
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
      title="Status of GET /api/health"
    >
      {state === 'loading' ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
      ) : (
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      )}
      {styles.text}
    </span>
  );
}
