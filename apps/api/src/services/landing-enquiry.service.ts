import { prisma } from '@/config/database';
import { LandingEnquiry } from '@prisma/client';
import { AppError } from '@/types';

export class LandingEnquiryService {
  async create(data: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    companyOrg?: string;
    message: string;
    idProof?: string;
    haveSource?: string;
  }): Promise<LandingEnquiry> {
    return prisma.landingEnquiry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address || '',
        companyOrg: data.companyOrg,
        message: data.message,
        idProof: data.idProof,
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

