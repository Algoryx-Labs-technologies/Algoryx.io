import express, { Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from '@/config/env';
import { morganFormat } from '@/utils/logger';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import routes from '@/routes';

export const createApp = (): Express => {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet());

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
