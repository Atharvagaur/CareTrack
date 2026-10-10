import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import issueRoutes from './routes/issue.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  app.use('/api/health', healthRoutes);
  app.use('/api/issues', issueRoutes);
  app.use('/api/ai', aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
