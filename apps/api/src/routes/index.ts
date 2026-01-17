import { Router } from 'express';
import userRoutes from './user.routes';
import { env } from '@/config/env';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: env.API_VERSION,
  });
});

// API routes
router.use('/users', userRoutes);

// Add more route modules here
// router.use('/posts', postRoutes);
// router.use('/auth', authRoutes);

export default router;

