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

// Routes
// 1. POST - Create ticket
router.post(
  '/',
  authenticate,
  validate(createTicketSchema),
  supportTicketController.createTicket.bind(supportTicketController)
);

// 2. GET - Get all tickets (for authenticated user)
router.get(
  '/',
  authenticate,
  supportTicketController.getAllTickets.bind(supportTicketController)
);

// 3. GET - Get tickets by user ID
router.get(
  '/user/:userId',
  authenticate,
  supportTicketController.getTicketsByUserId.bind(supportTicketController)
);

// 4. DELETE - Delete ticket
router.delete(
  '/:id',
  authenticate,
  supportTicketController.deleteTicket.bind(supportTicketController)
);

export default router;

