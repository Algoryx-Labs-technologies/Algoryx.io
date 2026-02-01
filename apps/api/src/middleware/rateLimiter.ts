import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';

// More permissive rate limiting in development
const isDevelopment = process.env.NODE_ENV === 'development';
const rateLimitMax = isDevelopment 
  ? 1000 // Much higher limit in development
  : parseInt(env.RATE_LIMIT_MAX_REQUESTS);

export const apiLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: rateLimitMax,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

