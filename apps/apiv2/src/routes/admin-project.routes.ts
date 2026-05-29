import { Router } from 'express';
import { z } from 'zod';
import {
  getAdminProjectStages,
  getAdminProjects,
  patchAdminProject,
  postAdminProject,
  removeAdminProject,
} from '@/controllers/admin-project.controller';
import { ADMIN_PROJECT_STAGES } from '@/models/admin-project.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const stageSchema = z.enum(ADMIN_PROJECT_STAGES);

const createAdminProjectSchema = {
  body: z.object({
    projectName: z.string().trim().min(1, 'Project name is required'),
    clientName: z.string().trim().min(1, 'Client name is required'),
    clientEmail: z
      .string()
      .trim()
      .optional()
      .transform((val) => (val === '' ? undefined : val))
      .pipe(z.string().email('Invalid email address').optional()),
    description: z.string().trim().optional(),
    budget: z.string().trim().optional(),
    deadline: z.string().trim().optional(),
    stage: stageSchema.optional(),
    teamMemberIds: z.array(z.string().trim().min(1)).optional(),
  }),
};

const updateAdminProjectSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Project id is required'),
  }),
  body: z
    .object({
      projectName: z.string().trim().min(1).optional(),
      clientName: z.string().trim().min(1).optional(),
      clientEmail: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val === '' ? undefined : val))
        .pipe(z.string().email().optional()),
      description: z.string().trim().optional(),
      budget: z.string().trim().optional(),
      deadline: z.string().trim().nullable().optional(),
      stage: stageSchema.optional(),
      teamMemberIds: z.array(z.string().trim().min(1)).optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Project id is required'),
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

router.get('/stages', getAdminProjectStages);
router.get('/', validate(listQuerySchema), getAdminProjects);
router.post('/', validate(createAdminProjectSchema), postAdminProject);
router.patch('/:id', validate(updateAdminProjectSchema), patchAdminProject);
router.delete('/:id', validate(idParamSchema), removeAdminProject);

export default router;
