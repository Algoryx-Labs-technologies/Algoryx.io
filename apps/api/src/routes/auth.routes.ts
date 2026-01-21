import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(['client', 'admin', 'partner']).optional(), // Optional role, defaults to 'client'
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    token: z.string().min(1),
  }),
});

const refreshSessionSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1),
  }),
});

// Public routes
router.post(
  '/signup',
  validate(signupSchema),
  authController.signup.bind(authController)
);

router.post(
  '/signin',
  validate(signinSchema),
  authController.signin.bind(authController)
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

router.post(
  '/refresh',
  validate(refreshSessionSchema),
  authController.refreshSession.bind(authController)
);

// Protected routes
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser.bind(authController)
);

router.post(
  '/signout',
  authenticate,
  authController.signout.bind(authController)
);

router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile.bind(authController)
);

export default router;
