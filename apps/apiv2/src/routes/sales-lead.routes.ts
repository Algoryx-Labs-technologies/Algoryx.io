import { Router } from 'express';
import { z } from 'zod';
import {
  getSalesLeadStages,
  getSalesLeads,
  patchSalesLead,
  postSalesLead,
  removeSalesLead,
} from '@/controllers/sales-lead.controller';
import { SALES_LEAD_STAGES } from '@/models/sales-lead.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const stageSchema = z.enum(SALES_LEAD_STAGES);

const createSalesLeadSchema = {
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string().trim().optional(),
    company: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    stage: stageSchema.optional(),
  }),
};

const updateSalesLeadSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Lead id is required'),
  }),
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      email: z.string().trim().email().optional(),
      phone: z.string().trim().optional(),
      company: z.string().trim().optional(),
      notes: z.string().trim().optional(),
      stage: stageSchema.optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Lead id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    stage: stageSchema.optional(),
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/stages', getSalesLeadStages);
router.get('/', validate(listQuerySchema), getSalesLeads);
router.post('/', validate(createSalesLeadSchema), postSalesLead);
router.patch('/:id', validate(updateSalesLeadSchema), patchSalesLead);
router.delete('/:id', validate(idParamSchema), removeSalesLead);

export default router;
