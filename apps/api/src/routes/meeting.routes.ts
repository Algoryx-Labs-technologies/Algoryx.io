import { Router } from 'express';
import { meetingController } from '@/controllers/meeting.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createMeetingSchema = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date: z.string().or(z.date()),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
    type: z.enum(['video', 'in_person', 'phone']),
    location: z.string().optional(),
    meetingLink: z.string().url().optional().or(z.literal('')),
    projectId: z.string().optional(),
    participants: z.array(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      role: z.string().optional(),
    })).optional(),
    googleEventId: z.string().optional(),
    syncedWithGoogle: z.boolean().optional(),
  }),
};

const updateMeetingSchema = {
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm').optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm').optional(),
    type: z.enum(['video', 'in_person', 'phone']).optional(),
    location: z.string().optional(),
    meetingLink: z.string().url().optional().or(z.literal('')),
    status: z.enum(['upcoming', 'completed', 'cancelled']).optional(),
    projectId: z.string().optional(),
    googleEventId: z.string().optional(),
    syncedWithGoogle: z.boolean().optional(),
  }),
};

const addParticipantSchema = {
  body: z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().optional(),
    role: z.string().optional(),
  }),
};

// Routes
// GET - Get all meetings (for authenticated user, admins see all)
router.get(
  '/',
  authenticate,
  meetingController.getAllMeetings.bind(meetingController)
);

// GET - Get upcoming meetings
router.get(
  '/upcoming',
  authenticate,
  meetingController.getUpcomingMeetings.bind(meetingController)
);

// GET - Get meetings by user ID (for admin to view specific user's meetings)
router.get(
  '/user/:userId',
  authenticate,
  meetingController.getMeetingsByUserId.bind(meetingController)
);

// GET - Get meeting by ID
router.get(
  '/:id',
  authenticate,
  meetingController.getMeetingById.bind(meetingController)
);

// POST - Create meeting
router.post(
  '/',
  authenticate,
  validate(createMeetingSchema),
  meetingController.createMeeting.bind(meetingController)
);

// PATCH - Update meeting
router.patch(
  '/:id',
  authenticate,
  validate(updateMeetingSchema),
  meetingController.updateMeeting.bind(meetingController)
);

// DELETE - Delete meeting
router.delete(
  '/:id',
  authenticate,
  meetingController.deleteMeeting.bind(meetingController)
);

// POST - Add participant to meeting
router.post(
  '/:id/participants',
  authenticate,
  validate(addParticipantSchema),
  meetingController.addParticipant.bind(meetingController)
);

// DELETE - Remove participant from meeting
router.delete(
  '/:id/participants/:participantId',
  authenticate,
  meetingController.removeParticipant.bind(meetingController)
);

export default router;

