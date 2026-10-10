import { useMemo } from 'react';
import { Layers, AlertTriangle, Clock, Ban, Check } from 'lucide-react';
import useIssues from '../hooks/useIssues.js';
import { getIssueMetrics, getStatusDistribution } from '../utils/issueStats.js';
import PageHeader from '../components/PageHeader.jsx';
import MetricCard from '../components/MetricCard.jsx';
import Card from '../components/Card.jsx';
import StatusDistributionChart from '../components/StatusDistributionChart.jsx';
import RecentIssuesTable from '../components/RecentIssuesTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';

function byNewest(a, b) {
  return new Date(b.updatedAt) - new Date(a.updatedAt);
}

export default function Dashboard() {
  const { issues, loading, error, refetch, isMock } = useIssues();

  const metrics = useMemo(() => getIssueMetrics(issues), [issues]);
  const distribution = useMemo(() => getStatusDistribution(issues), [issues]);
  const recentIssues = useMemo(
    () => [...issues].sort(byNewest).slice(0, 6),
    [issues]
  );

  return (
    <>
      <PageHeader
        title="Operations Dashboard"
        description="Operational issues across facilities, staffing, supply and IT systems."
      >
        {isMock && (
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            Sample data
          </span>
        )}
      </PageHeader>

      {loading && <LoadingState message="Loading dashboard…" />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total Issues" value={metrics.total} icon={Layers} tone="indigo" />
            <MetricCard label="Open" value={metrics.open} icon={AlertTriangle} tone="amber" />
            <MetricCard
              label="In Progress"
              value={metrics.in_progress}
              icon={Clock}
              tone="blue"
            />
            <MetricCard label="Blocked" value={metrics.blocked} icon={Ban} tone="rose" />
            <MetricCard label="Resolved" value={metrics.resolved} icon={Check} tone="emerald" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card
              title="Issues by status"
              subtitle="Distribution across the workflow"
              className="lg:col-span-1"
              bodyClassName="p-4 sm:p-5"
            >
              <StatusDistributionChart data={distribution} />
            </Card>

            <Card
              title="Recent issues"
              subtitle="Latest updates across the queue"
              className="lg:col-span-2"
              bodyClassName="p-0"
            >
              <RecentIssuesTable issues={recentIssues} emptyMessage="No issues found." />
            </Card>
          </div>
        </>
      )}
    </>
  );
}
