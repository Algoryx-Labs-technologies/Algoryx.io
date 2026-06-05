import { Router } from 'express';
import { getFinanceLedger, getSummary } from '@/controllers/finance.controller';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const router = Router();

router.use(authenticateAdmin);

router.get('/summary', getSummary);
router.get('/ledger', getFinanceLedger);

export default router;
