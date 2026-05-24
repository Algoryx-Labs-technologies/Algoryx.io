import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILandingRequirement extends Document {
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource: string;
  createdAt: Date;
  updatedAt: Date;
}

const landingRequirementSchema = new Schema<ILandingRequirement>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    companyOrg: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    haveSource: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'landing_requirements',
  },
);

export const LandingRequirement: Model<ILandingRequirement> =
  mongoose.models.LandingRequirement ??
  mongoose.model<ILandingRequirement>(
    'LandingRequirement',
    landingRequirementSchema,
  );
