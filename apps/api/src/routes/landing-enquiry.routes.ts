import { Router } from 'express';
import { landingEnquiryController } from '@/controllers/landing-enquiry.controller';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schema for creating landing enquiry
const createLandingEnquirySchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    companyOrg: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
    haveSource: z.string().optional(),
  }),
});

// Routes
// Public endpoint - no authentication required
router.post(
  '/',
  validate(createLandingEnquirySchema),
  landingEnquiryController.createEnquiry.bind(landingEnquiryController)
);

// Admin endpoints (can be added later with authentication)
// router.get(
//   '/',
//   authenticate,
//   landingEnquiryController.getAllEnquiries.bind(landingEnquiryController)
// );

// router.get(
//   '/:id',
//   authenticate,
//   landingEnquiryController.getEnquiryById.bind(landingEnquiryController)
// );

export default router;

