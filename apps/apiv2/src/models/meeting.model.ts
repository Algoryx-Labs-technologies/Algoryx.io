import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export const MEETING_STATUSES = [
  'upcoming',
  'follow_up',
  'cancelled',
  'completed',
] as const;

export const LEGACY_MEETING_STATUSES = ['scheduled'] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export interface IMeeting extends Document {
  meetingCode: string;
  title: string;
  status: MeetingStatus | 'scheduled';
  scheduledAt: Date;
  durationMinutes?: number;
  attendeeName?: string;
  attendeeEmail?: string;
  locationOrLink?: string;
  notes?: string;
  projectId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>(
  {
    meetingCode: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: [...MEETING_STATUSES, ...LEGACY_MEETING_STATUSES],
      default: 'upcoming',
    },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, min: 0 },
    attendeeName: { type: String, trim: true },
    attendeeEmail: { type: String, trim: true, lowercase: true },
    locationOrLink: { type: String, trim: true },
    notes: { type: String, trim: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminProject',
    },
  },
  {
    timestamps: true,
    collection: 'admin_meetings',
  },
);

export const Meeting: Model<IMeeting> =
  mongoose.models.Meeting ?? mongoose.model<IMeeting>('Meeting', meetingSchema);
