import { Router } from 'express';
import { requirementController } from '@/controllers/requirement.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createRequirementSchema = z.object({
  body: z.object({
    projectId: z.string().optional(),
    projectTitle: z.string().optional(),
    question: z.string().optional(),
    description: z.string().optional(),
    priority: z.string().optional(),
    answer: z.string().optional(),
  }),
});

const updateRequirementSchema = z.object({
  body: z.object({
    projectTitle: z.string().optional(),
    question: z.string().optional(),
    description: z.string().optional(),
    priority: z.string().optional(),
    answer: z.string().optional(),
  }),
});

// Routes
router.get(
  '/',
  authenticate,
  requirementController.getAllRequirements.bind(requirementController)
);

router.get(
  '/:id',
  authenticate,
  requirementController.getRequirementById.bind(requirementController)
);

router.post(
  '/',
  authenticate,
  validate(createRequirementSchema),
  requirementController.createRequirement.bind(requirementController)
);

router.patch(
  '/:id',
  authenticate,
  validate(updateRequirementSchema),
  requirementController.updateRequirement.bind(requirementController)
);

router.delete(
  '/:id',
  authenticate,
  requirementController.deleteRequirement.bind(requirementController)
);

export default router;

