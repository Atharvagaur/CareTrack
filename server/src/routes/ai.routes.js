import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { summarizeRequestSchema } from '../validators/ai.schema.js';
import { summarize } from '../controllers/ai.controller.js';

const router = Router();

router.post('/summarize', validate(summarizeRequestSchema, 'body'), summarize);

export default router;
