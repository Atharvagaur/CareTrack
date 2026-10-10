import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import {
  createIssueSchema,
  updateIssueSchema,
  listIssuesQuerySchema,
} from '../validators/issue.schema.js';
import {
  listIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issue.controller.js';

const router = Router();

router.get('/', validate(listIssuesQuerySchema, 'query'), listIssues);
router.get('/:id', getIssue);
router.post('/', validate(createIssueSchema, 'body'), createIssue);
router.put('/:id', validate(updateIssueSchema, 'body'), updateIssue);
router.delete('/:id', deleteIssue);

export default router;
