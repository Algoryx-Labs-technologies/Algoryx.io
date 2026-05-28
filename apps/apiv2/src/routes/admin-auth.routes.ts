import { Router } from 'express';
import { z } from 'zod';
import { adminLogin, adminMe } from '@/controllers/admin-auth.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';
import { loginLimiter } from '@/middleware/rateLimiter';

const router = Router();

const loginSchema = z.object({
  adminId: z.string().min(1, 'Admin ID is required'),
  password: z.string().min(1, 'Password is required'),
  mpin: z.string().min(1, 'MPIN is required'),
});

router.post(
  '/login',
  loginLimiter,
  validate({ body: loginSchema }),
  adminLogin,
);

router.get('/me', authenticateAdmin, adminMe);

export default router;
