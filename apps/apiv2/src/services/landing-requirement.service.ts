import {
  ILandingRequirement,
  LandingRequirement,
} from '@/models/landing-requirement.model';

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
