import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { meetingService } from '@/services/meeting.service';
import { googleCalendarService } from '@/services/google-calendar.service';
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
      participants,
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

    // For video meetings, auto-generate Google Meet link if not provided
    let finalMeetingLink = type === 'video' ? meetingLink : undefined;
    let finalGoogleEventId = googleEventId || undefined;
    let finalSyncedWithGoogle = syncedWithGoogle || false;

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
      meetingLink: finalMeetingLink,
      clientId: clientId || undefined,
      partnerId: partnerId || undefined,
      adminId: adminId || undefined,
      projectId: projectId || undefined,
      participants: participants || [],
      googleEventId: finalGoogleEventId,
      syncedWithGoogle: finalSyncedWithGoogle,
    };

    // Create the meeting first
    const meeting = await meetingService.create(meetingData);

    // For video meetings without a link, try to generate a real Google Meet link
    if (type === 'video' && !finalMeetingLink) {
      // Check if Google Calendar is configured
      if (googleCalendarService.isConfigured()) {
        try {
          // NOTE: To generate REAL Google Meet links, you need:
          // 1. Google OAuth credentials in .env (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
          // 2. User's Google OAuth access token (stored in database or provided)
          // 
          // For now, we'll check if there's a way to get user's token
          // You can either:
          // - Store user's Google tokens in User table or separate GoogleToken table
          // - Use a service account for generating all Meet links
          // - Have users authenticate with Google when creating meetings
          
          // TODO: Get user's Google OAuth token from database
          // Example: const userGoogleToken = await getUserGoogleToken(user.id);
          
          // For now, if you want to use a service account or admin's Google account:
          // You can set GOOGLE_ACCESS_TOKEN and GOOGLE_REFRESH_TOKEN in .env
          // and use them here:
          const adminAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
          const adminRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
          
          if (adminAccessToken) {
            // Use admin's Google account to create the event
            googleCalendarService.setCredentials(adminAccessToken, adminRefreshToken);
            
            // Create Google Calendar event with Google Meet
            const { eventId, meetLink } = await googleCalendarService.createEvent(meeting, true);
            
            if (meetLink) {
              // Update meeting with real Google Meet link and event ID
              const updatedMeeting = await meetingService.update(
                meeting.id,
                user.id,
                false,
                {
                  meetingLink: meetLink,
                  googleEventId: eventId,
                  syncedWithGoogle: true,
                }
              );

              res.status(201).json({
                success: true,
                data: updatedMeeting,
                message: 'Meeting created successfully with Google Meet link synced to calendar',
              });
              return;
            }
          } else {
            // Google Calendar is configured but no access token available
            throw new AppError(
              400,
              'Google Calendar is configured but no access token available. Please add GOOGLE_ACCESS_TOKEN to .env or implement user OAuth authentication.'
            );
          }
        } catch (error: any) {
          console.error('Error creating Google Meet link:', error);
          
          // If it's our custom error, throw it
          if (error instanceof AppError) {
            throw error;
          }
          
          // Otherwise, return error but don't fail the meeting creation
          res.status(201).json({
            success: true,
            data: meeting,
            message: 'Meeting created but Google Meet link generation failed. Please configure Google OAuth tokens.',
            warning: error.message || 'Failed to generate Google Meet link',
          });
          return;
        }
      } else {
        // Google Calendar not configured - return error
        throw new AppError(
          400,
          'Google Meet link generation requires Google Calendar API configuration. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file, and either GOOGLE_ACCESS_TOKEN or implement user OAuth authentication.'
        );
      }
    }

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

  async addParticipant(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const meetingId = Array.isArray(id) ? id[0] : id;
    const { email, name, role } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const participant = await meetingService.addParticipant(meetingId, {
      email,
      name,
      role: role || 'attendee',
    });

    res.status(201).json({
      success: true,
      data: participant,
      message: 'Participant added successfully',
    });
  }

  async removeParticipant(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id, participantId } = req.params;
    const meetingId = Array.isArray(id) ? id[0] : id;
    const participantIdParam = Array.isArray(participantId) ? participantId[0] : participantId;

    await meetingService.removeParticipant(meetingId, participantIdParam);

    res.json({
      success: true,
      message: 'Participant removed successfully',
    });
  }
}

export const meetingController = new MeetingController();

