import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from '@/config/env';
import { morganFormat, logger } from '@/utils/logger';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import routes from '@/routes';

export const createApp = (): Express => {
  const app = express();

  // CORS configuration (must be before helmet)
  // Helper function to normalize URLs (remove trailing slashes, lowercase)
  const normalizeOrigin = (url: string): string => {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  };

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Handle wildcard
      if (env.CORS_ORIGIN === '*') {
        return callback(null, true);
      }
      
      // Parse and normalize allowed origins (filter out empty strings from trailing commas)
      const allowedOrigins = env.CORS_ORIGIN.split(',')
        .map(normalizeOrigin)
        .filter(origin => origin.length > 0);
      const normalizedOrigin = normalizeOrigin(origin);
      
      // In development, allow localhost on any port for easier development
      if (env.NODE_ENV === 'development') {
        const isLocalhost = normalizedOrigin.startsWith('http://localhost:') || normalizedOrigin.startsWith('https://localhost:');
        const isAllowed = allowedOrigins.includes(normalizedOrigin);
        
        logger.debug(`CORS check - Origin: ${normalizedOrigin}, Allowed: [${allowedOrigins.join(', ')}], IsLocalhost: ${isLocalhost}, IsAllowed: ${isAllowed}`);
        
        // Allow localhost on any port in development
        if (isLocalhost || isAllowed) {
          return callback(null, true);
        }
        
        logger.warn(`CORS blocked - Origin: ${normalizedOrigin} not in allowed list: [${allowedOrigins.join(', ')}]`);
        return callback(null, false);
      }
      
      // Production: strict matching
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
  
  // Security middleware (after CORS)
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

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

