import { useMemo, useState } from 'react';
import useIssues from '../hooks/useIssues.js';
import { groupIssuesByStatus } from '../utils/issueStats.js';
import { updateIssue, getApiErrorMessage } from '../api/issues.js';
import PageHeader from '../components/PageHeader.jsx';
import IssueCard from '../components/IssueCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function KanbanBoard() {
  const { issues, loading, error, refetch, isMock } = useIssues({ sort: 'newest' });
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const columns = useMemo(() => groupIssuesByStatus(issues), [issues]);

  async function handleStatusChange(issue, status) {
    if (status === issue.status) return;
    setUpdatingId(issue.id);
    setActionError(null);
    try {
      await updateIssue(issue.id, { status });
      await refetch();
    } catch (err) {
      setActionError(getApiErrorMessage(err, 'Could not update the issue status'));
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Kanban Board" description="Issues grouped by workflow status." />
        <LoadingState message="Loading board…" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Kanban Board" description="Issues grouped by workflow status." />
        <ErrorState message={error} onRetry={refetch} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Kanban Board"
        description="Issues grouped by workflow status. Change status with the controls on each card."
      >
        {isMock && (
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Sample data
          </span>
        )}
      </PageHeader>

      {actionError && (
        <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
          {actionError}
        </div>
      )}

      {issues.length === 0 ? (
        <EmptyState message="No issues to show on the board." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <section
              key={column.status}
              className="flex flex-col rounded-xl border border-slate-200 bg-slate-100/70 p-3"
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${column.badgeClass}`}
                >
                  {column.label}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                  {column.issues.length}
                </span>
              </header>

              <div className="flex flex-1 flex-col gap-3">
                {column.issues.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-400">
                    No issues
                  </p>
                ) : (
                  column.issues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      updating={updatingId === issue.id}
                      onStatusChange={isMock ? undefined : handleStatusChange}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
