import { Router } from 'express';
import { z } from 'zod';
import {
  getExpenses,
  postExpense,
  removeExpense,
} from '@/controllers/expense.controller';
import { EXPENSE_TYPES } from '@/models/expense.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const expenseTypeSchema = z.enum(EXPENSE_TYPES);

const createExpenseSchema = {
  body: z
    .object({
      type: expenseTypeSchema,
      projectId: z.string().trim().optional(),
      title: z.string().trim().min(1, 'Title is required'),
      description: z.string().trim().optional(),
      amount: z.coerce.number().positive('Amount must be greater than zero'),
      currency: z.string().trim().optional(),
      expenseDate: z.string().trim().min(1, 'Expense date is required'),
    })
    .refine((body) => body.type !== 'project' || Boolean(body.projectId?.trim()), {
      message: 'Project is required for project expenses',
      path: ['projectId'],
    })
    .refine((body) => body.type !== 'company' || !body.projectId?.trim(), {
      message: 'Company expenses cannot be linked to a project',
      path: ['projectId'],
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Expense id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    type: expenseTypeSchema.optional(),
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/', validate(listQuerySchema), getExpenses);
router.post('/', validate(createExpenseSchema), postExpense);
router.delete('/:id', validate(idParamSchema), removeExpense);

export default router;
