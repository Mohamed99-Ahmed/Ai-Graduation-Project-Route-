import dotenv from 'dotenv';

dotenv.config();

const requiredKeys = ['MONGODB_URI'] as const;

type RequiredEnvKey = (typeof requiredKeys)[number];

function readEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  mongodbUri: readEnv('MONGODB_URI'),
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
