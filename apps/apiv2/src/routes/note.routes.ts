import { Router } from 'express';
import { z } from 'zod';
import {
  getNotes,
  patchNote,
  postNote,
  removeNote,
} from '@/controllers/note.controller';
import { validate } from '@/middleware/validate';
import { authenticateAdmin } from '@/middleware/authenticateAdmin';

const createNoteSchema = {
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string().trim().min(1, 'Content is required'),
  }),
};

const updateNoteSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Note id is required'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      content: z.string().trim().min(1).optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'At least one field is required',
    }),
};

const idParamSchema = {
  params: z.object({
    id: z.string().trim().min(1, 'Note id is required'),
  }),
};

const listQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
  }),
};

const router = Router();

router.use(authenticateAdmin);

router.get('/', validate(listQuerySchema), getNotes);
router.post('/', validate(createNoteSchema), postNote);
router.patch('/:id', validate(updateNoteSchema), patchNote);
router.delete('/:id', validate(idParamSchema), removeNote);

export default router;
