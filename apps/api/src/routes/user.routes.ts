import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

// Routes
router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

export default router;

