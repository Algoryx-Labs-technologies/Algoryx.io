import mongoose, { Document, Model, Schema } from 'mongoose';

export const SALES_LEAD_STAGES = [
  'discovery',
  'deal_closed',
  'in_progress',
  'completed',
] as const;

export type SalesLeadStage = (typeof SALES_LEAD_STAGES)[number];

export interface ISalesLead extends Document {
  leadCode: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  stage: SalesLeadStage;
  createdAt: Date;
  updatedAt: Date;
}

const salesLeadSchema = new Schema<ISalesLead>(
  {
    leadCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    notes: { type: String, trim: true },
    stage: {
      type: String,
      required: true,
      enum: SALES_LEAD_STAGES,
      default: 'discovery',
    },
  },
  {
    timestamps: true,
    collection: 'sales_leads',
  },
);

export const SalesLead: Model<ISalesLead> =
  mongoose.models.SalesLead ??
  mongoose.model<ISalesLead>('SalesLead', salesLeadSchema);
