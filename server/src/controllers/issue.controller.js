import mongoose from 'mongoose';
import Issue from '../models/Issue.js';

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function assertValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(400, `Invalid issue id: ${id}`);
  }
}

async function findIssueOrThrow(id) {
  assertValidId(id);
  const issue = await Issue.findById(id);
  if (!issue) {
    throw httpError(404, `Issue not found: ${id}`);
  }
  return issue;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** GET /api/issues - list with optional search, status/priority/category filters. */
export async function listIssues(req, res) {
  const { search, status, priority, category, sort } = req.validated;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  if (search) {
    const rx = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { assignee: rx }];
  }

  const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const issues = await Issue.find(filter).sort(sortOrder);

  res.json({ success: true, count: issues.length, data: issues });
}

/** GET /api/issues/:id - return a single issue. */
export async function getIssue(req, res) {
  const issue = await findIssueOrThrow(req.params.id);
  res.json({ success: true, data: issue });
}

/** POST /api/issues - validate and create an issue. */
export async function createIssue(req, res) {
  const issue = await Issue.create(req.validated);
  res.status(201).json({ success: true, data: issue });
}

/** PUT /api/issues/:id - validate and update an existing issue. */
export async function updateIssue(req, res) {
  const issue = await findIssueOrThrow(req.params.id);
  issue.set(req.validated);
  await issue.save();
  res.json({ success: true, data: issue });
}

/** DELETE /api/issues/:id - delete an issue. */
export async function deleteIssue(req, res) {
  const issue = await findIssueOrThrow(req.params.id);
  await issue.deleteOne();
  res.json({ success: true, data: { id: issue.id } });
}
