import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/connectDB.js';

async function start() {
  const dbConnected = await connectDB();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`[server] CareTrack API listening on http://localhost:${env.PORT}`);
    console.log(`[server] Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`[server] MongoDB: ${dbConnected ? 'connected' : 'NOT connected'}`);
  });

  const shutdown = (signal) => {
    console.log(`[server] Received ${signal}, shutting down`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
