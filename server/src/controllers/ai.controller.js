import { summarizeIssue } from '../services/ai.service.js';

/** POST /api/ai/summarize - returns { summary, mainProblem, nextSteps }. */
export async function summarize(req, res) {
  const { title, description } = req.validated;
  const data = await summarizeIssue({ title, description });
  res.json({ success: true, data });
}
