import mongoose, { Document, Model, Schema } from 'mongoose';

export const PORTFOLIO_CATEGORIES = ['recent', 'ongoing', 'past'] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export interface IPortfolioProject extends Document {
  title: string;
  description?: string;
  category: PortfolioCategory;
  imageUrl: string;
  imagePublicId?: string;
  techStack: string[];
  clientName?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: PORTFOLIO_CATEGORIES,
      required: true,
    },
    imageUrl: { type: String, required: true, trim: true },
    imagePublicId: { type: String, trim: true },
    techStack: { type: [String], default: [] },
    clientName: { type: String, trim: true },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'portfolio_projects',
  },
);

portfolioProjectSchema.index({ category: 1, createdAt: -1 });

export const PortfolioProject: Model<IPortfolioProject> =
  mongoose.models.PortfolioProject ??
  mongoose.model<IPortfolioProject>('PortfolioProject', portfolioProjectSchema);
