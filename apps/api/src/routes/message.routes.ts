import { Router } from 'express';
import { messageController } from '@/controllers/message.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createMessageSchema = {
  body: z.object({
    recipientId: z.string().min(1, 'Recipient ID is required'),
    content: z.string().min(1, 'Message content is required'),
    conversationId: z.string().optional(),
  }),
};

// Routes - accessible by both admin and client
router.get(
  '/conversations',
  authenticate,
  messageController.getAllConversations.bind(messageController)
);

router.get(
  '/conversations/:id',
  authenticate,
  messageController.getConversationById.bind(messageController)
);

router.get(
  '/conversations/:id/messages',
  authenticate,
  messageController.getConversationMessages.bind(messageController)
);

router.get(
  '/conversations/:id/unread-count',
  authenticate,
  messageController.getConversationUnreadCount.bind(messageController)
);

router.post(
  '/',
  authenticate,
  validate(createMessageSchema),
  messageController.createMessage.bind(messageController)
);

router.patch(
  '/conversations/:id/read',
  authenticate,
  messageController.markConversationAsRead.bind(messageController)
);

router.patch(
  '/messages/:id/read',
  authenticate,
  messageController.markMessageAsSeen.bind(messageController)
);

router.get(
  '/unread-count',
  authenticate,
  messageController.getUnreadCount.bind(messageController)
);

// Admin-only routes
router.get(
  '/clients',
  authenticate,
  messageController.getClients.bind(messageController)
);

// Client-only routes
router.get(
  '/admins',
  authenticate,
  messageController.getAdmins.bind(messageController)
);

export default router;
