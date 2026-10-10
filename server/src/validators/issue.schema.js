import { z } from 'zod';
import {
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_CATEGORIES,
} from '../constants/issues.js';

/** Maps a case-insensitive label or key (e.g. "In Progress") to its enum key. */
function normalizeEnum(values, labels) {
  return z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    const lower = value.trim().toLowerCase();
    if (values.includes(lower)) return lower;
    return values.find((key) => labels[key].toLowerCase() === lower) ?? value;
  }, z.enum(values));
}

/** Categories are stored with display casing (e.g. "IT Systems"). */
const categoryMap = Object.fromEntries(ISSUE_CATEGORIES.map((value) => [value.toLowerCase(), value]));

const categorySchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  return categoryMap[value.trim().toLowerCase()] ?? value;
}, z.enum(ISSUE_CATEGORIES));

const titleSchema = z.string().trim().min(3, 'Title must be at least 3 characters').max(200);
const descriptionSchema = z
  .string()
  .trim()
  .min(1, 'Description is required')
  .max(5000, 'Description must be 5000 characters or fewer');
const assigneeSchema = z.string().trim().max(120).nullable();

const statusSchema = normalizeEnum(ISSUE_STATUSES, ISSUE_STATUS_LABELS);
const prioritySchema = normalizeEnum(ISSUE_PRIORITIES, ISSUE_PRIORITY_LABELS);

export const createIssueSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    category: categorySchema,
    priority: prioritySchema.default('medium'),
    status: statusSchema.default('open'),
    assignee: assigneeSchema.optional(),
  })
  .strict();

export const updateIssueSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    category: categorySchema.optional(),
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
    assignee: assigneeSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

export const listIssuesQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  category: categorySchema.optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});
