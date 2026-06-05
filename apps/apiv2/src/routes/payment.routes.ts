import { Router } from 'express';
import { z } from 'zod';
import {
  getPaymentStatuses,
  getPayments,
  patchPayment,
  postPayment,
  removePayment,
} from '@/controllers/payment.controller';
import { PAYMENT_STATUSES } from '@/models/payment.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const statusSchema = z.enum(PAYMENT_STATUSES);

const createPaymentSchema = {
  body: z.object({
    projectId: z.string().trim().min(1, 'Project is required'),
    amount: z.coerce.number().positive('Amount must be greater than zero'),
    currency: z.string().trim().optional(),
    deadline: z.string().trim().min(1, 'Deadline is required'),
    status: statusSchema.optional(),
    description: z.string().trim().optional(),
  }),
};

const updatePaymentSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Payment id is required'),
  }),
  body: z
    .object({
      projectId: z.string().trim().min(1).optional(),
      amount: z.coerce.number().positive().optional(),
      currency: z.string().trim().optional(),
      deadline: z.string().trim().optional(),
      status: statusSchema.optional(),
      description: z.string().trim().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Payment id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    status: statusSchema.optional(),
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/statuses', getPaymentStatuses);
router.get('/', validate(listQuerySchema), getPayments);
router.post('/', validate(createPaymentSchema), postPayment);
router.patch('/:id', validate(updatePaymentSchema), patchPayment);
router.delete('/:id', validate(idParamSchema), removePayment);

export default router;
