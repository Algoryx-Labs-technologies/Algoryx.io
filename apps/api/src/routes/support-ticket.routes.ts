import { Router } from 'express';
import { supportTicketController } from '@/controllers/support-ticket.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createTicketSchema = {
  body: z.object({
    issueType: z.string().min(1, 'Issue type is required'),
    description: z.string().min(1, 'Description is required'),
    priority: z.enum(['low', 'mid', 'high'], {
      errorMap: () => ({ message: 'Priority must be low, mid, or high' }),
    }),
    additionalDetails: z.string().optional(),
  }),
};

const updateTicketSchema = {
  body: z.object({
    issueType: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(['low', 'mid', 'high']).optional(),
    additionalDetails: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
  }),
};

// Routes
router.get(
  '/',
  authenticate,
  supportTicketController.getAllTickets.bind(supportTicketController)
);

router.get(
  '/:id',
  authenticate,
  supportTicketController.getTicketById.bind(supportTicketController)
);

router.get(
  '/ticket/:ticketId',
  authenticate,
  supportTicketController.getTicketByTicketId.bind(supportTicketController)
);

router.post(
  '/',
  authenticate,
  validate(createTicketSchema),
  supportTicketController.createTicket.bind(supportTicketController)
);

router.patch(
  '/:id',
  authenticate,
  validate(updateTicketSchema),
  supportTicketController.updateTicket.bind(supportTicketController)
);

router.delete(
  '/:id',
  authenticate,
  supportTicketController.deleteTicket.bind(supportTicketController)
);

export default router;

