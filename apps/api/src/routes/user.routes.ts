import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateProfileSchema = {
  body: z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
  }),
};

// Routes
router.get('/profile', authenticate, userController.getProfile.bind(userController));
router.get('/:id', authenticate, userController.getUserById.bind(userController));
router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

export default router;

