import { Router } from 'express';
import { getDashboard } from '@/controllers/dashboard.controller';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);
router.get('/summary', getDashboard);

export default router;
