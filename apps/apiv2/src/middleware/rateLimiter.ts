import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';

const isDevelopment = env.NODE_ENV === 'development';
const rateLimitMax = isDevelopment
  ? 1000
  : parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10);

export const apiLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
  max: rateLimitMax,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 100 : 10,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 60 : 20,
  message: {
    success: false,
    error: 'Too many chat messages. Please wait a moment and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
