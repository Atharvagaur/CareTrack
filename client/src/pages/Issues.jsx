import { useMemo, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import useIssues from '../hooks/useIssues.js';
import useDebouncedValue from '../hooks/useDebouncedValue.js';
import {
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  PRIORITY_META,
  STATUS_META,
} from '../constants/issues.js';
import { createIssue, updateIssue, deleteIssue, getApiErrorMessage } from '../api/issues.js';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import RecentIssuesTable from '../components/RecentIssuesTable.jsx';
import Modal from '../components/Modal.jsx';
import IssueFormModal from '../components/IssueFormModal.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';

const FILTER_CLASS =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export default function Issues() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [category, setCategory] = useState('all');

  const debouncedQuery = useDebouncedValue(query);

  const params = useMemo(
    () => ({
      search: debouncedQuery.trim() || undefined,
      status: status !== 'all' ? status : undefined,
      priority: priority !== 'all' ? priority : undefined,
      category: category !== 'all' ? category : undefined,
      sort: 'newest',
    }),
    [debouncedQuery, status, priority, category]
  );

  const { issues, loading, error, refetch, isMock } = useIssues(params);
  const hasActiveFilters =
    Boolean(debouncedQuery.trim()) || status !== 'all' || priority !== 'all' || category !== 'all';

  const [form, setForm] = useState({ open: false, mode: 'create', issue: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function openCreate() {
    setFeedback(null);
    setForm({ open: true, mode: 'create', issue: null });
  }

  function openEdit(issue) {
    setFeedback(null);
    setForm({ open: true, mode: 'edit', issue });
  }

  function closeForm() {
    setForm({ open: false, mode: 'create', issue: null });
  }

  async function handleSubmit(payload, issue) {
    if (issue) {
      await updateIssue(issue.id, payload);
    } else {
      await createIssue(payload);
    }
    closeForm();
    setFeedback({
      type: 'success',
      message: issue ? 'Issue updated.' : 'Issue created.',
    });
    await refetch();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteIssue(deleteTarget.id);
      setDeleteTarget(null);
      setFeedback({ type: 'success', message: 'Issue deleted.' });
      await refetch();
    } catch (err) {
      setDeleteTarget(null);
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Could not delete the issue') });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Issues"
        description="All operational issues reported by the operations team."
      >
        {isMock && (
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Sample data
          </span>
        )}
        {!isMock && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            New issue
          </button>
        )}
      </PageHeader>

      {feedback && (
        <div
          className={`mb-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
              : 'border-rose-100 bg-rose-50 text-rose-700'
          }`}
          role="status"
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-medium underline-offset-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <Card bodyClassName="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, category, assignee"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={FILTER_CLASS}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {ISSUE_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_META[value].label}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className={FILTER_CLASS}
              aria-label="Filter by priority"
            >
              <option value="all">All priorities</option>
              {ISSUE_PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {PRIORITY_META[value].label}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={FILTER_CLASS}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {ISSUE_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <LoadingState message="Loading issues…" />}

        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && issues.length === 0 && (
          <EmptyState
            message={
              hasActiveFilters
                ? 'No issues match the current filters.'
                : 'No issues yet. Create the first one.'
            }
          />
        )}

        {!loading && !error && issues.length > 0 && (
          <>
            <RecentIssuesTable
              issues={issues}
              onEdit={isMock ? undefined : openEdit}
              onDelete={isMock ? undefined : (issue) => setDeleteTarget(issue)}
            />
            <p className="mt-4 px-4 text-xs text-slate-400 sm:px-6">
              Showing {issues.length} issue{issues.length === 1 ? '' : 's'}
              {hasActiveFilters ? ' (filtered)' : ''}
            </p>
          </>
        )}
      </Card>

      {form.open && (
        <IssueFormModal
          mode={form.mode}
          issue={form.issue}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <Modal
          title="Delete issue"
          onClose={() => (busy ? null : setDeleteTarget(null))}
          footer={
            <>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={busy}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-500 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </>
          }
        >
          <p className="text-sm text-slate-600">
            Delete <span className="font-medium text-slate-800">{deleteTarget.title}</span>? This
            action cannot be undone.
          </p>
        </Modal>
      )}
    </>
  );
}
