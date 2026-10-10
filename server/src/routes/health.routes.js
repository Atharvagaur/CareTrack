import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { healthQuerySchema } from '../validators/health.schema.js';
import { getMongoStatus } from '../db/connectDB.js';

const router = Router();

router.get('/', validate(healthQuerySchema, 'query'), (req, res) => {
  const payload = {
    status: 'ok',
    service: 'caretrack-api',
    message: 'CareTrack API is running',
    timestamp: new Date().toISOString(),
    mongo: getMongoStatus(),
  };

  if (req.validated?.verbose === 'true') {
    payload.uptimeSeconds = Math.round(process.uptime());
    payload.nodeVersion = process.version;
    payload.env = process.env.NODE_ENV || 'development';
  }

  res.json(payload);
});

export default router;
