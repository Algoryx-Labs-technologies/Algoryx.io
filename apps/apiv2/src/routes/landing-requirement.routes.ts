import { Router } from 'express';
import { z } from 'zod';
import {
  getLandingRequirements,
  postLandingRequirement,
  removeLandingRequirement,
} from '@/controllers/landing-requirement.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const hearAboutUsValues = [
  'instagram',
  'linkedin',
  'google',
  'friend',
  'youtube',
  'community',
  'other',
] as const;

const createLandingRequirementSchema = {
  body: z.object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string().trim().min(1, 'Phone number is required'),
    companyOrg: z.string().trim().optional(),
    message: z.string().trim().min(1, 'Message is required'),
    haveSource: z
      .string()
      .trim()
      .min(1, 'How did you hear about us is required')
      .refine(
        (val) =>
          hearAboutUsValues.includes(val as (typeof hearAboutUsValues)[number]),
        { message: 'Invalid source option' },
      ),
  }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Requirement id is required'),
  }),
};

const router = Router();

router.get('/', authenticateAdmin, getLandingRequirements);
router.delete(
  '/:id',
  authenticateAdmin,
  validate(idParamSchema),
  removeLandingRequirement,
);

router.post(
  '/',
  validate(createLandingRequirementSchema),
  postLandingRequirement,
);

export default router;
