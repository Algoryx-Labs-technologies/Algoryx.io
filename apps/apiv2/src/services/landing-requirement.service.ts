import {
  ILandingRequirement,
  LandingRequirement,
} from '@/models/landing-requirement.model';
import { AppError } from '@/types';

export interface CreateLandingRequirementInput {
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource: string;
}

export const createLandingRequirement = async (
  data: CreateLandingRequirementInput,
): Promise<ILandingRequirement> => {
  return LandingRequirement.create(data);
};

export interface LandingRequirementListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource: string;
  createdAt: string;
  updatedAt: string;
}

export const listLandingRequirements = async (): Promise<
  LandingRequirementListItem[]
> => {
  const records = await LandingRequirement.find()
    .sort({ createdAt: -1 })
    .lean();

  return records.map((record) => ({
    id: String(record._id),
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    companyOrg: record.companyOrg,
    message: record.message,
    haveSource: record.haveSource,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }));
};

export const deleteLandingRequirement = async (id: string): Promise<void> => {
  const result = await LandingRequirement.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Requirement not found');
  }
};
