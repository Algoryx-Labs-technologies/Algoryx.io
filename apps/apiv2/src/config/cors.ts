import cors, { CorsOptions } from 'cors';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const normalizeOrigin = (url: string): string =>
  url.trim().toLowerCase().replace(/\/+$/, '');

const parseAllowedOrigins = (): string[] =>
  env.CORS_ORIGIN.split(',')
    .map(normalizeOrigin)
    .filter((origin) => origin.length > 0);

const isLocalhostOrigin = (origin: string): boolean =>
  origin.startsWith('http://localhost:') ||
  origin.startsWith('https://localhost:');

const isOriginAllowed = (origin: string, allowedOrigins: string[]): boolean => {
  if (env.CORS_ORIGIN === '*') {
    return true;
  }

  const normalized = normalizeOrigin(origin);

  if (env.NODE_ENV === 'development') {
    return isLocalhostOrigin(normalized) || allowedOrigins.includes(normalized);
  }

  return allowedOrigins.includes(normalized);
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = parseAllowedOrigins();

    if (isOriginAllowed(origin, allowedOrigins)) {
      return callback(null, true);
    }

    const normalized = normalizeOrigin(origin);

    if (env.NODE_ENV === 'development') {
      logger.warn(`CORS blocked origin: ${normalized}`);
      return callback(new Error(`CORS: Origin ${normalized} not allowed`), false);
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
