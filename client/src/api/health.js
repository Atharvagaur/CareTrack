import apiClient from './client.js';

/** GET /api/health - used by the API status indicator. */
export async function fetchHealth() {
  const { data } = await apiClient.get('/health');
  return data;
}
