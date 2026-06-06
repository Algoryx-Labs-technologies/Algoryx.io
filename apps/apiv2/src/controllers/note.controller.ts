import { Request, Response, NextFunction } from 'express';
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from '@/services/note.service';

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const notes = await listNotes({ search });

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const postNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;
    const note = await createNote({ title, content });

    res.status(201).json({
      success: true,
      data: note,
      message: 'Note created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const note = await updateNote(id, req.body);

    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteNote(id);

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
