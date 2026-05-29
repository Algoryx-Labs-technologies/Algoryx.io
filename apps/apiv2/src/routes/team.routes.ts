import { Router } from 'express';
import { z } from 'zod';
import {
  getTeamMembers,
  postTeamMember,
  removeTeamMember,
} from '@/controllers/team.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const createMemberSchema = {
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Invalid email address'),
    role: z.string().trim().min(1, 'Role is required'),
  }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Member id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/', validate(listQuerySchema), getTeamMembers);
router.post('/', validate(createMemberSchema), postTeamMember);
router.delete('/:id', validate(idParamSchema), removeTeamMember);

export default router;
