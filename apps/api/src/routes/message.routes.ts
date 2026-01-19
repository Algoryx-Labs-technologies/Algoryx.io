import { Router } from 'express';
import { messageController } from '@/controllers/message.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createMessageSchema = z.object({
  body: z.object({
    recipientId: z.string().min(1, 'Recipient ID is required'),
    recipientRole: z.enum(['admin', 'partner'], {
      errorMap: () => ({ message: 'Recipient role must be admin or partner' }),
    }),
    conversationId: z.string().optional(),
    subject: z.string().optional(),
    content: z.string().min(1, 'Message content is required'),
  }),
});

// Routes
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

router.get(
  '/unread-count',
  authenticate,
  messageController.getUnreadCount.bind(messageController)
);

export default router;

