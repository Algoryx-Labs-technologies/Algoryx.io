import { Router } from 'express';
import { adminController } from '@/controllers/admin.controller';
import { requireAdmin } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router: Router = Router();

// Validation schemas
const createProjectSchema = {
  body: z.object({
    clientId: z.string().optional(),
    partnerId: z.string().optional(),
    projectName: z.string().optional(),
    readMe: z.string().optional(),
    techStack: z.string().optional(),
    clientRequirement: z.string().optional(),
    projectTimeline: z.any().optional(),
    projectStatus: z.enum(['not_started', 'initiated', 'in_progress', 'completed', 'delivered']).optional(),
    projectFeatures: z.string().optional(),
    priority: z.enum(['low', 'mid', 'high']).optional(),
    progressStatus: z.string().optional(),
    Budget: z.string().optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  }),
};

const updateProjectSchema = {
  body: z.object({
    clientId: z.string().optional(),
    partnerId: z.string().optional(),
    projectName: z.string().optional(),
    readMe: z.string().optional(),
    techStack: z.string().optional(),
    clientRequirement: z.string().optional(),
    projectTimeline: z.any().optional(),
    projectStatus: z.enum(['not_started', 'initiated', 'in_progress', 'completed', 'delivered']).optional(),
    projectFeatures: z.string().optional(),
    priority: z.enum(['low', 'mid', 'high']).optional(),
    progressStatus: z.string().optional(),
    Budget: z.string().optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  }),
};

const createNotificationSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['info', 'success', 'warning', 'error', 'reminder', 'update']).optional(),
    userId: z.string().optional(),
  }),
};

const createPaymentSchema = {
  body: z.object({
    userId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    amount: z.number().min(0, 'Amount must be positive'),
    currency: z.string().optional(),
    status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
    paymentMethod: z.string().optional(),
    transactionId: z.string().optional(),
    description: z.string().optional(),
    metadata: z.any().optional(),
  }),
};

const replyToTicketSchema = {
  body: z.object({
    reply: z.string().min(1, 'Reply is required'),
    status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
  }),
};

const updateSupportTicketSchema = {
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
    priority: z.enum(['low', 'mid', 'high']).optional(),
    issueType: z.string().optional(),
    description: z.string().optional(),
    additionalDetails: z.string().optional(),
  }),
};

const createCommunityPostSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPinned: z.boolean().optional(),
  }),
};

const selectTopFeedbackSchema = {
  body: z.object({
    isTop: z.boolean().optional(),
  }),
};

const replyToQnASchema = {
  body: z.object({
    answer: z.string().min(1, 'Answer is required'),
    isAccepted: z.boolean().optional(),
  }),
};

const updatePaymentSchema = {
  body: z.object({
    userId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    amount: z.number().min(0).optional(),
    currency: z.string().optional(),
    status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
    paymentMethod: z.string().optional(),
    transactionId: z.string().optional(),
    description: z.string().optional(),
    metadata: z.any().optional(),
  }),
};

// All routes require admin authentication
router.use(requireAdmin);

// Project Management Routes
router.get(
  '/projects',
  adminController.getAllProjects.bind(adminController)
);

router.post(
  '/projects',
  validate(createProjectSchema),
  adminController.createProject.bind(adminController)
);

router.patch(
  '/projects/:id',
  validate(updateProjectSchema),
  adminController.updateProject.bind(adminController)
);

router.delete(
  '/projects/:id',
  adminController.deleteProject.bind(adminController)
);

// Notification Management Routes
router.post(
  '/notifications',
  validate(createNotificationSchema),
  adminController.createNotification.bind(adminController)
);

// Payment Management Routes
router.post(
  '/payments',
  validate(createPaymentSchema),
  adminController.createPayment.bind(adminController)
);

// Support Ticket Reply Routes
router.post(
  '/support-tickets/:ticketId/reply',
  validate(replyToTicketSchema),
  adminController.replyToTicket.bind(adminController)
);

// Support Ticket Update Routes
router.patch(
  '/support-tickets/:ticketId',
  validate(updateSupportTicketSchema),
  adminController.updateSupportTicket.bind(adminController)
);

// Community Management Routes
router.post(
  '/community',
  validate(createCommunityPostSchema),
  adminController.createCommunityPost.bind(adminController)
);

// Feedback Management Routes
router.post(
  '/feedback/:feedbackId/top',
  validate(selectTopFeedbackSchema),
  adminController.selectTopFeedback.bind(adminController)
);

// Requirement Management Routes
router.post(
  '/requirements/:requirementId/contacted',
  adminController.markRequirementContacted.bind(adminController)
);
router.post(
  '/requirements/:requirementId/rejected',
  adminController.markRequirementRejected.bind(adminController)
);

// QnA Management Routes
router.post(
  '/qna/:qnaId/reply',
  validate(replyToQnASchema),
  adminController.replyToQnA.bind(adminController)
);

// GET Routes
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/landing-requirements', adminController.getLandingRequirements.bind(adminController));
router.get('/landing-enquiries', adminController.getLandingEnquiries.bind(adminController));
router.get('/requirements', adminController.getClientRequirements.bind(adminController));
router.get('/support-tickets', adminController.getClientSupportTickets.bind(adminController));
router.get('/feedback', adminController.getFeedback.bind(adminController));
router.get('/payments', adminController.getPayments.bind(adminController));
router.patch('/payments/:id', validate(updatePaymentSchema), adminController.updatePayment.bind(adminController));
router.get('/notifications', adminController.getAllNotifications.bind(adminController));
router.get('/community', adminController.getCommunity.bind(adminController));
router.get('/qna', adminController.getQnA.bind(adminController));

export default router;
