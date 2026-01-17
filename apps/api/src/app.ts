import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from '@/config/env';
import { morganFormat } from '@/utils/logger';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import routes from '@/routes';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  const corsOptions = {
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // Logging
  if (env.NODE_ENV === 'development') {
    app.use(morgan(morganFormat));
  }

  // Rate limiting
  app.use(`/api/${env.API_VERSION}`, apiLimiter);

  // API routes
  app.use(`/api/${env.API_VERSION}`, routes);

  // Root route
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Algoryx API Server',
      version: env.API_VERSION,
      docs: `/api/${env.API_VERSION}/health`,
    });
  });

  // 404 handler
  app.use(notFound);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};

