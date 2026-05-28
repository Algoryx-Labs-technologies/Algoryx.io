import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    role: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'team_members',
  },
);

export const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ??
  mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
