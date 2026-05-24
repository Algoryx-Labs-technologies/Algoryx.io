import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from '@/config/env';
import { morganFormat, logger } from '@/utils/logger';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import routes from '@/routes';

const normalizeOrigin = (url: string): string =>
  url.trim().toLowerCase().replace(/\/+$/, '');

export const createApp = (): Express => {
  const app = express();

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        return callback(null, true);
      }

      if (env.CORS_ORIGIN === '*') {
        return callback(null, true);
      }

      const allowedOrigins = env.CORS_ORIGIN.split(',')
        .map(normalizeOrigin)
        .filter((o) => o.length > 0);
      const normalizedOrigin = normalizeOrigin(origin);

      if (env.NODE_ENV === 'development') {
        const isLocalhost =
          normalizedOrigin.startsWith('http://localhost:') ||
          normalizedOrigin.startsWith('https://localhost:');
        if (isLocalhost || allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }
        logger.warn(`CORS blocked origin: ${normalizedOrigin}`);
        return callback(new Error(`CORS: Origin ${normalizedOrigin} not allowed`), false);
      }

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(compression());

  if (env.NODE_ENV === 'development') {
    app.use(morgan(morganFormat));
  }

  const apiPrefix = `/api/${env.API_VERSION}`;
  app.use(apiPrefix, apiLimiter);
  app.use(apiPrefix, routes);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Algoryx API v2',
      version: env.API_VERSION,
      health: `${apiPrefix}/health`,
    });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
