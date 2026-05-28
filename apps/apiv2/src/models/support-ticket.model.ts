import mongoose, { Document, Model, Schema } from 'mongoose';

export const SUPPORT_CATEGORIES = [
  'general',
  'technical',
  'billing',
  'feature-request',
  'account',
  'other',
] as const;

export const SUPPORT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export const SUPPORT_SOURCES = ['landing_help'] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];
export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number];
export type SupportSource = (typeof SUPPORT_SOURCES)[number];

export interface ISupportAttachment {
  originalName: string;
  mimeType: string;
  size: number;
  data: Buffer;
}

export interface IClientMetadata {
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
}

export interface ISupportTicket extends Document {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  attachment?: ISupportAttachment;
  client: IClientMetadata;
  source: SupportSource;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<ISupportAttachment>(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { _id: false },
);

const clientMetadataSchema = new Schema<IClientMetadata>(
  {
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    referer: { type: String, trim: true },
  },
  { _id: false },
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: SUPPORT_CATEGORIES,
    },
    priority: {
      type: String,
      required: true,
      enum: SUPPORT_PRIORITIES,
    },
    description: { type: String, required: true, trim: true },
    attachment: { type: attachmentSchema, required: false },
    client: { type: clientMetadataSchema, required: true },
    source: {
      type: String,
      required: true,
      enum: SUPPORT_SOURCES,
      default: 'landing_help',
    },
  },
  {
    timestamps: true,
    collection: 'support_tickets',
  },
);

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket ??
  mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
