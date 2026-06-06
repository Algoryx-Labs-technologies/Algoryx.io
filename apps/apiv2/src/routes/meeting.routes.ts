import { Router } from 'express';
import { z } from 'zod';
import {
  getMeetingMeta,
  getMeetings,
  patchMeeting,
  postMeeting,
  removeMeeting,
} from '@/controllers/meeting.controller';
import { MEETING_STATUSES } from '@/models/meeting.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const statusSchema = z.enum(MEETING_STATUSES);

const createMeetingSchema = {
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    status: statusSchema.optional(),
    scheduledAt: z.string().trim().min(1, 'Scheduled date is required'),
    attendeeName: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    projectId: z.string().trim().optional(),
  }),
};

const updateMeetingSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Meeting id is required'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      status: statusSchema.optional(),
      scheduledAt: z.string().trim().optional(),
      attendeeName: z.string().trim().optional(),
      notes: z.string().trim().optional(),
      projectId: z.string().trim().nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Meeting id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    status: statusSchema.optional(),
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/meta', getMeetingMeta);
router.get('/', validate(listQuerySchema), getMeetings);
router.post('/', validate(createMeetingSchema), postMeeting);
router.patch('/:id', validate(updateMeetingSchema), patchMeeting);
router.delete('/:id', validate(idParamSchema), removeMeeting);

export default router;
