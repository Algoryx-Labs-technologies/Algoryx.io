import { Router } from 'express';
import { z } from 'zod';
import { getSupportTicket, getSupportTickets, postSupportTicket } from '@/controllers/support.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';
import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  SUPPORT_SOURCES,
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

const listQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
    category: z.enum(SUPPORT_CATEGORIES).optional(),
    priority: z.enum(SUPPORT_PRIORITIES).optional(),
    source: z.enum(SUPPORT_SOURCES).optional(),
  }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Ticket id is required'),
  }),
};

const router = Router();

router.post('/', validate(createSupportTicketSchema), postSupportTicket);

router.get(
  '/',
  authenticateAdmin,
  validate(listQuerySchema),
  getSupportTickets,
);

router.get(
  '/:id',
  authenticateAdmin,
  validate(idParamSchema),
  getSupportTicket,
);

export default router;
