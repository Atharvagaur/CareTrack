import { z } from 'zod';

/** Body for POST /api/ai/summarize. */
export const summarizeRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .max(200, 'Title must be 200 characters or fewer'),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(5000, 'Description must be 5000 characters or fewer'),
  })
  .strict();

/**
 * Structure the model must return. Unknown keys are stripped rather than
 * rejected so minor deviations from the provider do not break the response.
 */
export const aiSummarySchema = z.object({
  summary: z.string().trim().min(1).max(2000),
  mainProblem: z.string().trim().min(1).max(2000),
  nextSteps: z
    .array(z.string().trim().min(1).max(1000))
    .length(3, 'Exactly three next steps are required'),
});
