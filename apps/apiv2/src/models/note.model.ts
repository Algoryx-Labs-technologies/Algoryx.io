import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'admin_notes',
  },
);

export const Note: Model<INote> =
  mongoose.models.Note ?? mongoose.model<INote>('Note', noteSchema);
