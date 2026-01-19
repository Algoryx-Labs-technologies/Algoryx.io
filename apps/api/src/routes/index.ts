import { Router } from 'express';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import messageRoutes from './message.routes';
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
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);

// Add more route modules here
// router.use('/posts', postRoutes);
// router.use('/auth', authRoutes);

export default router;

