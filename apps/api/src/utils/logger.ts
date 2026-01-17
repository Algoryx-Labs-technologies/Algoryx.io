import morgan from 'morgan';
import { Request, Response } from 'express';

// Custom token for request ID
morgan.token('id', (req: Request) => {
  return (req as any).id || '-';
});

// Custom format
export const morganFormat = ':method :url :status :response-time ms - :res[content-length]';

// Logger utility
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

