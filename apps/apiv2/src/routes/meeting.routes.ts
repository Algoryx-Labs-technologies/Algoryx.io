import { Router } from 'express';
import { z } from 'zod';
import {
  getMeetingMeta,
  getMeetings,
  patchMeeting,
  postMeeting,
  removeMeeting,
} from '@/controllers/meeting.controller';
import { MEETING_STATUSES, MEETING_TYPES } from '@/models/meeting.model';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const typeSchema = z.enum(MEETING_TYPES);
const statusSchema = z.enum(MEETING_STATUSES);

const createMeetingSchema = {
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    type: typeSchema.optional(),
    status: statusSchema.optional(),
    scheduledAt: z.string().trim().min(1, 'Scheduled date is required'),
    durationMinutes: z.coerce.number().int().min(0).optional(),
    attendeeName: z.string().trim().optional(),
    attendeeEmail: z
      .string()
      .trim()
      .optional()
      .transform((val) => (val === '' ? undefined : val))
      .pipe(z.string().email().optional()),
    locationOrLink: z.string().trim().optional(),
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
      type: typeSchema.optional(),
      status: statusSchema.optional(),
      scheduledAt: z.string().trim().optional(),
      durationMinutes: z.coerce.number().int().min(0).nullable().optional(),
      attendeeName: z.string().trim().optional(),
      attendeeEmail: z
        .string()
        .trim()
        .optional()
        .transform((val) => (val === '' ? undefined : val))
        .pipe(z.string().email().optional()),
      locationOrLink: z.string().trim().optional(),
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
    type: typeSchema.optional(),
    upcoming: z.enum(['true', 'false']).optional(),
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
