import { Router } from 'express';
import { notificationController } from '@/controllers/notification.controller';
import { requireAdmin, authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router: Router = Router();

// Validation schema for creating notifications
const createNotificationSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['info', 'success', 'warning', 'error', 'reminder', 'update']).optional(),
    userId: z.string().optional().nullable(), // null or undefined = universal notification
  }),
};

// Create notification (universal or user-specific) - Admin only
router.post(
  '/',
  requireAdmin,
  validate(createNotificationSchema),
  notificationController.createNotification.bind(notificationController)
);

// Get notifications - Authenticated users can view
// Query params: userId (optional) - if provided, returns universal + user-specific notifications
router.get(
  '/',
  authenticate,
  notificationController.getNotifications.bind(notificationController)
);

export default router;

