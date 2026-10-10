import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Lightbulb, ListChecks, FileText } from 'lucide-react';
import Modal from './Modal.jsx';
import ErrorState from './ErrorState.jsx';
import LoadingState from './LoadingState.jsx';
import { summarizeIssue } from '../api/ai.js';
import { getApiErrorMessage } from '../api/issues.js';

/**
 * Generates and displays an AI summary for a single issue.
 * No mock/fake output: failures are shown as errors.
 */
export default function AISummaryModal({ issue, onClose }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const requestRef = useRef(0);

  const run = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setState({ status: 'loading', data: null, error: null });

    try {
      const data = await summarizeIssue({
        title: issue.title,
        description: issue.description ?? '',
      });
      if (requestRef.current !== requestId) return;
      setState({ status: 'success', data, error: null });
    } catch (err) {
      if (requestRef.current !== requestId) return;
      setState({
        status: 'error',
        data: null,
        error: getApiErrorMessage(err, 'Could not generate the summary'),
      });
    }
  }, [issue.title, issue.description]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <Modal title={`AI summary · ${issue.id}`} onClose={onClose} size="max-w-2xl">
      {state.status === 'loading' && (
        <LoadingState message="Generating summary with OpenRouter…" />
      )}

      {state.status === 'error' && (
        <ErrorState message={state.error} onRetry={run} />
      )}

      {state.status === 'success' && (
        <div className="space-y-5">
          <section>
            <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <FileText className="h-4 w-4 text-indigo-500" />
              Summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">{state.data.summary}</p>
          </section>

          <section>
            <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Main operational problem
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">{state.data.mainProblem}</p>
          </section>

          <section>
            <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <ListChecks className="h-4 w-4 text-emerald-500" />
              Suggested next steps
            </h3>
            <ol className="space-y-2">
              {state.data.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            AI-generated suggestions for human review. These are not verified facts and are never
            executed automatically.
          </p>
        </div>
      )}
    </Modal>
  );
}
