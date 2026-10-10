import mongoose from 'mongoose';
import { env } from '../config/env.js';

const STATE_LABELS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

mongoose.connection.on('connected', () => {
  console.log(`[db] MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[db] MongoDB error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[db] MongoDB disconnected');
});

/**
 * Attempts to connect to MongoDB. Never throws: returns true on success and
 * false on failure so the API can still start and report its real status.
 */
export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    return true;
  } catch (err) {
    console.warn(`[db] MongoDB connection failed: ${err.message}`);
    console.warn('[db] The API will start without a database connection.');
    return false;
  }
}

/** Reads the live driver state - never assumes a connection exists. */
export function getMongoStatus() {
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    state: STATE_LABELS[readyState] ?? 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}
