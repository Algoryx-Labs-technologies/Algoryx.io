import { INote, Note } from '@/models/note.model';
import { AppError } from '@/types';

export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

const toListItem = (record: INote): NoteListItem => ({
  id: String(record._id),
  title: record.title,
  content: record.content,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export interface ListNotesOptions {
  search?: string;
}

export const listNotes = async (
  options: ListNotesOptions = {},
): Promise<NoteListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: regex }, { content: regex }];
  }

  const records = await Note.find(filter).sort({ updatedAt: -1 }).lean();

  return records.map((record) => toListItem(record as unknown as INote));
};

export const createNote = async (data: CreateNoteInput): Promise<NoteListItem> => {
  const record = await Note.create({
    title: data.title,
    content: data.content,
  });

  return toListItem(record);
};

export const updateNote = async (
  id: string,
  data: UpdateNoteInput,
): Promise<NoteListItem> => {
  const record = await Note.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    throw new AppError(404, 'Note not found');
  }

  return toListItem(record);
};

export const deleteNote = async (id: string): Promise<void> => {
  const result = await Note.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Note not found');
  }
};
