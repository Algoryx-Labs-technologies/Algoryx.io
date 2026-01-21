import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import messageRoutes from './message.routes';
import requirementRoutes from './requirement.routes';
import webhookRoutes from './webhook.routes';
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
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/requirements', requirementRoutes);
router.use('/webhooks', webhookRoutes);

export default router;

