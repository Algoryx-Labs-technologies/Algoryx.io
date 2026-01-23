import { Request, Response } from 'express';
import { landingEnquiryService } from '@/services/landing-enquiry.service';
import { AppError } from '@/types';

export class LandingEnquiryController {
  async createEnquiry(req: Request, res: Response) {
    const { fullName, email, phone, address, companyOrg, message, idProof, haveSource } = req.body;

    const enquiry = await landingEnquiryService.create({
      fullName,
      email,
      phone,
      address,
      companyOrg,
      message,
      idProof,
      haveSource,
    });

    res.status(201).json({
      success: true,
      data: enquiry,
      message: 'Enquiry submitted successfully',
    });
  }

  async getEnquiryById(req: Request, res: Response) {
    const { id } = req.params;

    const enquiry = await landingEnquiryService.findById(id);

    if (!enquiry) {
      throw new AppError(404, 'Enquiry not found');
    }

    res.json({
      success: true,
      data: enquiry,
    });
  }

  async getAllEnquiries(req: Request, res: Response) {
    const enquiries = await landingEnquiryService.findAll();

    res.json({
      success: true,
      data: enquiries,
    });
  }
}

export const landingEnquiryController = new LandingEnquiryController();

