import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import messageRoutes from './message.routes';
import requirementRoutes from './requirement.routes';
import meetingRoutes from './meeting.routes';
import supportTicketRoutes from './support-ticket.routes';
import feedbackRoutes from './feedback.routes';
import webhookRoutes from './webhook.routes';
import landingEnquiryRoutes from './landing-enquiry.routes';
import adminRoutes from './admin.routes';
import clientRoutes from './client.routes';
import { env } from '@/config/env';
import { prisma } from '@/config/database';

const router = Router();

// Health check with database status
router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbLatency = null;
  
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const endTime = Date.now();
    dbLatency = `${endTime - startTime}ms`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }
  
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: env.API_VERSION,
    database: {
      status: dbStatus,
      latency: dbLatency,
    },
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/requirements', requirementRoutes);
router.use('/meetings', meetingRoutes);
router.use('/support/tickets', supportTicketRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/landing-enquiries', landingEnquiryRoutes);
router.use('/admin', adminRoutes);

export default router;

