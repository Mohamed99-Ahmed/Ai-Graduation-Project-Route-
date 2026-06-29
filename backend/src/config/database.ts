import mongoose from 'mongoose';

import { env } from './env.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  return mongoose.connect(env.mongodbUri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function databaseConnectionState(): string {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
}
