import mongoose, { Document, Model, Schema } from 'mongoose';

export const FEEDBACK_TYPES = [
  'website',
  'product',
  'service',
  'suggestion',
  'content',
  'support',
  'pricing',
  'bug',
  'partnership',
  'praise',
  'other',
] as const;

export const FEEDBACK_RATINGS = [1, 2, 3, 4, 5] as const;

export const FEEDBACK_SOURCES = ['landing_feedback'] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
export type FeedbackRating = (typeof FEEDBACK_RATINGS)[number];
export type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];

export interface IClientMetadata {
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}

export interface IFeedback extends Document {
  name: string;
  email: string;
  type: FeedbackType;
  rating?: FeedbackRating;
  message: string;
  client: IClientMetadata;
  source: FeedbackSource;
  createdAt: Date;
  updatedAt: Date;
}

const clientMetadataSchema = new Schema<IClientMetadata>(
  {
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    referer: { type: String, trim: true },
  },
  { _id: false },
);

const feedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    type: {
      type: String,
      required: true,
      enum: FEEDBACK_TYPES,
    },
    rating: {
      type: Number,
      enum: FEEDBACK_RATINGS,
    },
    message: { type: String, required: true, trim: true },
    client: { type: clientMetadataSchema, required: true },
    source: {
      type: String,
      required: true,
      enum: FEEDBACK_SOURCES,
      default: 'landing_feedback',
    },
  },
  {
    timestamps: true,
    collection: 'feedbacks',
  },
);

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ?? mongoose.model<IFeedback>('Feedback', feedbackSchema);
