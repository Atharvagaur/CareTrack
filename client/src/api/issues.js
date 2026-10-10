import apiClient from './client.js';

/** Removes empty/undefined values so we never send blank query params. */
function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

/** GET /api/issues - list with optional search + status/priority/category/sort. */
export async function listIssues(params = {}) {
  const { data } = await apiClient.get('/issues', { params: cleanParams(params) });
  if (Array.isArray(data)) return data;
  return data.data ?? [];
}

/** GET /api/issues/:id */
export async function getIssue(id) {
  const { data } = await apiClient.get(`/issues/${id}`);
  return data.data ?? data;
}

/** POST /api/issues */
export async function createIssue(payload) {
  const { data } = await apiClient.post('/issues', payload);
  return data.data ?? data;
}

/** PUT /api/issues/:id */
export async function updateIssue(id, payload) {
  const { data } = await apiClient.put(`/issues/${id}`, payload);
  return data.data ?? data;
}

/** DELETE /api/issues/:id */
export async function deleteIssue(id) {
  const { data } = await apiClient.delete(`/issues/${id}`);
  return data.data ?? data;
}

/** Turns any Axios/network error into a human-readable message. */
export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  const apiError = error?.response?.data?.error;

  if (apiError?.message) {
    const details = Array.isArray(apiError.details)
      ? apiError.details.map((detail) => detail.message).filter(Boolean)
      : [];
    return details.length ? `${apiError.message}: ${details.join(', ')}` : apiError.message;
  }

  if (error?.code === 'ERR_NETWORK') {
    return 'Cannot reach the CareTrack API. Is the server running on port 5000?';
  }

  return error?.message || fallback;
}
