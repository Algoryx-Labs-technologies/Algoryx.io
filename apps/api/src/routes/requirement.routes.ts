import { Router } from 'express';
import { requirementController } from '@/controllers/requirement.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createRequirementSchema = {
  body: z.object({
    projectId: z.string().optional(),
    projectTitle: z.string().optional(),
    description: z.string().optional(),
    Budget: z.string().optional(),
  }),
};

const updateRequirementSchema = {
  body: z.object({
    projectTitle: z.string().optional(),
    description: z.string().optional(),
    Budget: z.string().optional(),
  }),
};

// Routes
// GET - Get all requirements (for authenticated user)
router.get(
  '/',
  authenticate,
  requirementController.getAllRequirements.bind(requirementController)
);

// GET - Get requirements by user ID
router.get(
  '/user/:userId',
  authenticate,
  requirementController.getRequirementsByUserId.bind(requirementController)
);

// POST - Create requirement
router.post(
  '/',
  authenticate,
  validate(createRequirementSchema),
  requirementController.createRequirement.bind(requirementController)
);

// PATCH - Update requirement
router.patch(
  '/:id',
  authenticate,
  validate(updateRequirementSchema),
  requirementController.updateRequirement.bind(requirementController)
);

// DELETE - Delete requirement
router.delete(
  '/:id',
  authenticate,
  requirementController.deleteRequirement.bind(requirementController)
);

export default router;

