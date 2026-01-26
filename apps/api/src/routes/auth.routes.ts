import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const signupSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    role: z.enum(['client', 'admin', 'partner']).optional(), // Optional role, defaults to 'client'
  }),
};

const signinSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

const updateProfileSchema = {
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    password: z.string().min(6),
    token: z.string().min(1),
  }),
};

const refreshSessionSchema = {
  body: z.object({
    refresh_token: z.string().min(1),
  }),
};

const adminSignupSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
  }),
};

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

// Admin-specific auth routes
router.post(
  '/admin/signup',
  validate(adminSignupSchema),
  authController.adminSignup.bind(authController)
);

router.post(
  '/admin/signin',
  validate(signinSchema),
  authController.adminSignin.bind(authController)
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
