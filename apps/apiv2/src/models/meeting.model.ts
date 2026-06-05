import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export const MEETING_TYPES = ['meeting', 'follow_up', 'call', 'internal'] as const;
export const MEETING_STATUSES = ['scheduled', 'completed', 'cancelled'] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];
export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export interface IMeeting extends Document {
  meetingCode: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
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
    type: {
      type: String,
      required: true,
      enum: MEETING_TYPES,
      default: 'meeting',
    },
    status: {
      type: String,
      required: true,
      enum: MEETING_STATUSES,
      default: 'scheduled',
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
