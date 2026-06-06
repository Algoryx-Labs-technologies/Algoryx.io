import { Router } from 'express';
import { z } from 'zod';
import {
  getFeedback,
  getFeedbackList,
  postFeedback,
  removeFeedback,
} from '@/controllers/feedback.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';
import {
  FEEDBACK_RATINGS,
  FEEDBACK_SOURCES,
  FEEDBACK_TYPES,
} from '@/models/feedback.model';

const createFeedbackSchema = {
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    email: z.string().trim().email('Invalid email address'),
    type: z.enum(FEEDBACK_TYPES, {
      errorMap: () => ({ message: 'Invalid feedback type' }),
    }),
    rating: z
      .union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
      ])
      .optional(),
    message: z.string().trim().min(1, 'Message is required').max(10000),
  }),
};

const listQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
    type: z.enum(FEEDBACK_TYPES).optional(),
    source: z.enum(FEEDBACK_SOURCES).optional(),
  }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Feedback id is required'),
  }),
};

const router = Router();

router.post('/', validate(createFeedbackSchema), postFeedback);

router.get('/', authenticateAdmin, validate(listQuerySchema), getFeedbackList);

router.get('/:id', authenticateAdmin, validate(idParamSchema), getFeedback);

router.delete('/:id', authenticateAdmin, validate(idParamSchema), removeFeedback);

export default router;
