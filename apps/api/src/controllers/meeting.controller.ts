import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { meetingService } from '@/services/meeting.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';
import { MeetingType, MeetingStatus } from '@prisma/client';

export class MeetingController {
  async getClientId(userId: string): Promise<string | null> {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return client?.uid || null;
  }

  async getPartnerId(userId: string): Promise<string | null> {
    const partner = await prisma.partner.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return partner?.uid || null;
  }

  async getAdminId(userId: string): Promise<string | null> {
    const admin = await prisma.admin.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return admin?.uid || null;
  }

  async getAllMeetings(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isAdmin = user.role === 'admin';
    const meetings = await meetingService.findAll(user.id, isAdmin);

    res.json({
      success: true,
      data: meetings,
    });
  }

  async getUpcomingMeetings(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isAdmin = user.role === 'admin';
    const meetings = await meetingService.findUpcoming(user.id, isAdmin);

    res.json({
      success: true,
      data: meetings,
    });
  }

  async getMeetingsByUserId(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { userId } = req.params;
    const userIdParam = Array.isArray(userId) ? userId[0] : userId;

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Only admins can view other users' meetings, or users can view their own
    const isAdmin = user.role === 'admin';
    if (!isAdmin && userIdParam !== user.id) {
      throw new AppError(403, 'You can only view your own meetings');
    }

    const meetings = await meetingService.findAll(userIdParam, false);

    res.json({
      success: true,
      data: meetings,
    });
  }

  async getMeetingById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const meetingId = Array.isArray(id) ? id[0] : id;

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isAdmin = user.role === 'admin';
    const meeting = await meetingService.findById(meetingId, user.id, isAdmin);

    if (!meeting) {
      throw new AppError(404, 'Meeting not found');
    }

    res.json({
      success: true,
      data: meeting,
    });
  }

  async createMeeting(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      type,
      location,
      meetingLink,
      projectId,
      googleEventId,
      syncedWithGoogle,
    } = req.body;

    if (!title || !date || !startTime || !endTime || !type) {
      throw new AppError(400, 'Title, date, startTime, endTime, and type are required');
    }

    // Validate meeting type
    if (!['video', 'in_person', 'phone'].includes(type)) {
      throw new AppError(400, 'Invalid meeting type. Must be video, in_person, or phone');
    }

    // For video meetings, meeting link is required
    if (type === 'video' && !meetingLink) {
      throw new AppError(400, 'Meeting link is required for video meetings');
    }

    // Get role-specific IDs
    const clientId = await this.getClientId(user.id);
    const partnerId = await this.getPartnerId(user.id);
    const adminId = await this.getAdminId(user.id);

    // Parse date string to Date object
    const meetingDate = new Date(date);
    if (isNaN(meetingDate.getTime())) {
      throw new AppError(400, 'Invalid date format');
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new AppError(400, 'Invalid time format. Use HH:mm format');
    }

    // Create meeting data
    const meetingData = {
      userId: user.id,
      title,
      description,
      date: meetingDate,
      startTime,
      endTime,
      type: type as MeetingType,
      location: type === 'in_person' ? location : undefined,
      meetingLink: type === 'video' ? meetingLink : undefined,
      clientId: clientId || undefined,
      partnerId: partnerId || undefined,
      adminId: adminId || undefined,
      projectId: projectId || undefined,
      googleEventId: googleEventId || undefined,
      syncedWithGoogle: syncedWithGoogle || false,
    };

    // Create the meeting
    const meeting = await meetingService.create(meetingData);

    res.status(201).json({
      success: true,
      data: meeting,
      message: 'Meeting created successfully',
    });
  }

  async updateMeeting(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const meetingId = Array.isArray(id) ? id[0] : id;

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isAdmin = user.role === 'admin';
    const updateData: any = { ...req.body };

    // Parse date if provided
    if (updateData.date) {
      const meetingDate = new Date(updateData.date);
      if (isNaN(meetingDate.getTime())) {
        throw new AppError(400, 'Invalid date format');
      }
      updateData.date = meetingDate;
    }

    // Validate time format if provided
    if (updateData.startTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updateData.startTime)) {
        throw new AppError(400, 'Invalid startTime format. Use HH:mm format');
      }
    }

    if (updateData.endTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updateData.endTime)) {
        throw new AppError(400, 'Invalid endTime format. Use HH:mm format');
      }
    }

    // Validate meeting type if provided
    if (updateData.type && !['video', 'in_person', 'phone'].includes(updateData.type)) {
      throw new AppError(400, 'Invalid meeting type. Must be video, in_person, or phone');
    }

    // Validate status if provided
    if (updateData.status && !['upcoming', 'completed', 'cancelled'].includes(updateData.status)) {
      throw new AppError(400, 'Invalid status. Must be upcoming, completed, or cancelled');
    }

    const meeting = await meetingService.update(meetingId, user.id, isAdmin, updateData);

    res.json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully',
    });
  }

  async deleteMeeting(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const meetingId = Array.isArray(id) ? id[0] : id;

    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isAdmin = user.role === 'admin';
    await meetingService.delete(meetingId, user.id, isAdmin);

    res.json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  }
}

export const meetingController = new MeetingController();

