import apiClient from './client.js';

/**
 * POST /api/ai/summarize
 * @param {{ title: string, description: string }} payload
 * @returns {Promise<{ summary: string, mainProblem: string, nextSteps: string[] }>}
 */
export async function summarizeIssue({ title, description }) {
  const { data } = await apiClient.post('/ai/summarize', { title, description });
  return data.data ?? data;
}
