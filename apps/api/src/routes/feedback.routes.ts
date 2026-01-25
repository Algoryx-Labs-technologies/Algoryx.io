import { Router } from 'express';
import { feedbackController } from '@/controllers/feedback.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schema
const createFeedbackSchema = {
  body: z.object({
    overallRating: z.number().min(1).max(5, 'Overall rating must be between 1 and 5'),
    serviceQuality: z.number().min(1).max(5).optional(),
    communication: z.number().min(1).max(5).optional(),
    timeliness: z.number().min(1).max(5).optional(),
    valueForMoney: z.number().min(1).max(5).optional(),
    feedback: z.string().optional(),
    wouldRecommend: z.boolean().nullable().optional(),
    improvements: z.string().optional(),
    favoriteFeature: z.string().optional(),
  }),
};

// Routes
// POST - Create feedback
router.post(
  '/',
  authenticate,
  validate(createFeedbackSchema),
  feedbackController.createFeedback.bind(feedbackController)
);

export default router;

