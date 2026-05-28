import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export const ADMIN_PROJECT_STAGES = [
  'not_started',
  'in_progress',
  'completed',
  'delivered',
] as const;

export type AdminProjectStage = (typeof ADMIN_PROJECT_STAGES)[number];

export interface IAdminProject extends Document {
  projectCode: string;
  projectName: string;
  clientName: string;
  clientEmail?: string;
  description?: string;
  budget?: string;
  deadline?: Date;
  stage: AdminProjectStage;
  assignedTeamIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const adminProjectSchema = new Schema<IAdminProject>(
  {
    projectCode: { type: String, required: true, unique: true, trim: true },
    projectName: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    description: { type: String, trim: true },
    budget: { type: String, trim: true },
    deadline: { type: Date },
    stage: {
      type: String,
      required: true,
      enum: ADMIN_PROJECT_STAGES,
      default: 'not_started',
    },
    assignedTeamIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TeamMember',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'admin_projects',
  },
);

export const AdminProject: Model<IAdminProject> =
  mongoose.models.AdminProject ??
  mongoose.model<IAdminProject>('AdminProject', adminProjectSchema);
