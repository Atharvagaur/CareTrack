import { useCallback, useEffect, useState } from 'react';
import { listIssues, getApiErrorMessage } from '../api/issues.js';
import { MOCK_ISSUES } from '../data/mockData.js';

/**
 * Mock mode is opt-in for local development. The real API is the default so a
 * failed request surfaces an error instead of masking it with sample data.
 */
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY_MS = 400;

/** Applies the same filters the backend supports, for mock mode only. */
function filterMockIssues(issues, params = {}) {
  const { search, status, priority, category } = params;
  let result = issues;

  if (status) result = result.filter((issue) => issue.status === status);
  if (priority) result = result.filter((issue) => issue.priority === priority);
  if (category) result = result.filter((issue) => issue.category === category);

  if (search) {
    const term = search.trim().toLowerCase();
    result = result.filter((issue) =>
      [issue.title, issue.category, issue.assignee]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  return result;
}

/**
 * Loads issues for the UI.
 * @param {object} params optional { search, status, priority, category, sort }
 * @returns { issues, loading, error, refetch, isMock }
 */
export default function useIssues(params = {}) {
  const paramsKey = JSON.stringify(params ?? {});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_API) {
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
        setIssues(filterMockIssues(MOCK_ISSUES, params));
      } else {
        const data = await listIssues(params);
        setIssues(data);
      }
    } catch (err) {
      // Never fall back to mock data - surface the real failure.
      setIssues([]);
      setError(getApiErrorMessage(err, 'Unable to load issues'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { issues, loading, error, refetch: load, isMock: USE_MOCK_API };
}
