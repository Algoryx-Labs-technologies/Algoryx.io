import { Router } from 'express';
import { z } from 'zod';
import { postSupportTicket } from '@/controllers/support.controller';
import { handleSupportUpload } from '@/middleware/supportUpload';
import { validate } from '@/middleware/validate';
import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
} from '@/models/support-ticket.model';

const createSupportTicketSchema = {
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    email: z.string().trim().email('Invalid email address'),
    subject: z.string().trim().min(1, 'Subject is required').max(300),
    category: z.enum(SUPPORT_CATEGORIES, {
      errorMap: () => ({ message: 'Invalid category' }),
    }),
    priority: z.enum(SUPPORT_PRIORITIES, {
      errorMap: () => ({ message: 'Invalid priority' }),
    }),
    description: z.string().trim().min(1, 'Description is required').max(10000),
  }),
};

const router = Router();

router.post(
  '/',
  handleSupportUpload,
  validate(createSupportTicketSchema),
  postSupportTicket,
);

export default router;
