import { Router } from 'express';
import { projectController } from '@/controllers/project.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createProjectSchema = {
  body: z.object({
    projectName: z.string().optional(),
    readMe: z.string().optional(),
    techStack: z.string().optional(),
    clientRequirement: z.string().optional(),
    projectTimeline: z.string().optional(),
    projectStatus: z.enum(['not_started', 'initiated', 'in_progress', 'completed', 'delivered']).optional(),
    projectFeatures: z.string().optional(),
    priority: z.string().optional(),
    progressStatus: z.string().optional(),
  }),
};

const updateProjectSchema = {
  body: z.object({
    projectName: z.string().optional(),
    readMe: z.string().optional(),
    techStack: z.string().optional(),
    clientRequirement: z.string().optional(),
    projectTimeline: z.string().optional(),
    projectStatus: z.enum(['not_started', 'initiated', 'in_progress', 'completed', 'delivered']).optional(),
    projectFeatures: z.string().optional(),
    priority: z.string().optional(),
    progressStatus: z.string().optional(),
  }),
};

// Routes
router.get(
  '/',
  authenticate,
  projectController.getAllProjects.bind(projectController)
);

router.get(
  '/:id',
  authenticate,
  projectController.getProjectById.bind(projectController)
);

router.post(
  '/',
  authenticate,
  validate(createProjectSchema),
  projectController.createProject.bind(projectController)
);

router.patch(
  '/:id',
  authenticate,
  validate(updateProjectSchema),
  projectController.updateProject.bind(projectController)
);

router.delete(
  '/:id',
  authenticate,
  projectController.deleteProject.bind(projectController)
);

export default router;

