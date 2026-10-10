
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/connectDB.js';

async function start() {
  const dbConnected = await connectDB();
  const app = createApp();

  const PORT = Number(process.env.PORT || env.PORT || 5000);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] CareTrack API listening on port ${PORT}`);
    console.log(`[server] Health check: /api/health`);
    console.log(
      `[server] MongoDB: ${dbConnected ? 'connected' : 'NOT connected'}`
    );
  });

  const shutdown = (signal) => {
    console.log(`[server] Received ${signal}, shutting down`);

    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
