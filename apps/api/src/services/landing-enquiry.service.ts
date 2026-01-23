import { prisma } from '@/config/database';
import { LandingEnquiry } from '@prisma/client';
import { AppError } from '@/types';

export class LandingEnquiryService {
  async create(data: {
    fullName: string;
    email: string;
    phone: string;
    companyOrg?: string;
    message: string;
    haveSource?: string;
  }): Promise<LandingEnquiry> {
    return prisma.landingEnquiry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyOrg: data.companyOrg,
        message: data.message,
        haveSource: data.haveSource,
      },
    });
  }

  async findById(uid: string): Promise<LandingEnquiry | null> {
    return prisma.landingEnquiry.findUnique({
      where: { uid },
    });
  }

  async findAll(): Promise<LandingEnquiry[]> {
    return prisma.landingEnquiry.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}

export const landingEnquiryService = new LandingEnquiryService();

