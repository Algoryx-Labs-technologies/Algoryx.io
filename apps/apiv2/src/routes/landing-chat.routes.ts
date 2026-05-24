import { Router } from 'express';
import { z } from 'zod';
import { postLandingChat } from '@/controllers/landing-chat.controller';
import { validate } from '@/middleware/validate';
import { chatLimiter } from '@/middleware/rateLimiter';

const chatSchema = {
  body: z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().min(1).max(4000),
        }),
      )
      .min(1)
      .max(24),
  }),
};

const router = Router();

router.post('/', chatLimiter, validate(chatSchema), postLandingChat);

export default router;
