import { randomUUID } from 'crypto';
import { prisma } from '@/config/database';
import { Meeting, MeetingType, MeetingStatus } from '@prisma/client';
import { AppError } from '@/types';

export class MeetingService {
  async findAll(userId: string, isAdmin: boolean = false): Promise<Meeting[]> {
    try {
      const where: any = isAdmin ? {} : { userId };
      
      return await prisma.meeting.findMany({
        where,
        include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
        Admin: {
          select: {
            uid: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
            projectInformation: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    } catch (error: any) {
      console.error('Error in MeetingService.findAll:', error);
      throw new AppError(500, `Failed to fetch meetings: ${error.message}`);
    }
  }

  async findUpcoming(userId: string, isAdmin: boolean = false): Promise<Meeting[]> {
    try {
      const now = new Date();
      const where: any = isAdmin 
        ? { 
            date: { gte: now },
            status: 'upcoming',
          }
        : { 
            userId,
            date: { gte: now },
            status: 'upcoming',
          };
      
      return await prisma.meeting.findMany({
        where,
        include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
        Admin: {
          select: {
            uid: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
            projectInformation: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    } catch (error: any) {
      console.error('Error in MeetingService.findUpcoming:', error);
      throw new AppError(500, `Failed to fetch upcoming meetings: ${error.message}`);
    }
  }

  async findById(id: string, userId: string, isAdmin: boolean = false): Promise<Meeting | null> {
    try {
      const where: any = { id };
      if (!isAdmin) {
        where.userId = userId;
      }

      return await prisma.meeting.findFirst({
        where,
        include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
        Admin: {
          select: {
            uid: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
            projectInformation: true,
          },
        },
      },
    });
    } catch (error: any) {
      console.error('Error in MeetingService.findById:', error);
      throw new AppError(500, `Failed to fetch meeting: ${error.message}`);
    }
  }

  async create(data: {
    userId: string;
    title: string;
    description?: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: MeetingType;
    location?: string;
    meetingLink?: string;
    clientId?: string;
    partnerId?: string;
    adminId?: string;
    projectId?: string;
    googleEventId?: string;
    syncedWithGoogle?: boolean;
  }): Promise<Meeting> {
    try {
      const meeting = await prisma.meeting.create({
        data: {
          id: randomUUID(),
          ...data,
        },
        include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
        Admin: {
          select: {
            uid: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
            projectInformation: true,
          },
        },
      },
    });

      const createdMeeting = await this.findById(meeting.id, data.userId, false);
      if (!createdMeeting) {
        throw new AppError(500, 'Failed to retrieve created meeting');
      }
      return createdMeeting;
    } catch (error: any) {
      console.error('Error in MeetingService.create:', error);
      throw new AppError(500, `Failed to create meeting: ${error.message}`);
    }
  }

  async update(
    id: string,
    userId: string,
    isAdmin: boolean,
    data: Partial<{
      title: string;
      description: string;
      date: Date;
      startTime: string;
      endTime: string;
      type: MeetingType;
      location: string;
      meetingLink: string;
      status: MeetingStatus;
      clientId: string;
      partnerId: string;
      adminId: string;
      projectId: string;
      googleEventId: string;
      syncedWithGoogle: boolean;
    }>
  ): Promise<Meeting> {
    try {
      // Verify the meeting belongs to the user (unless admin)
      if (!isAdmin) {
        const meeting = await prisma.meeting.findFirst({
          where: {
            id,
            userId,
          },
        });
        
        if (!meeting) {
          throw new AppError(404, 'Meeting not found');
        }
      } else {
        const meeting = await prisma.meeting.findFirst({
          where: { id },
        });
        
        if (!meeting) {
          throw new AppError(404, 'Meeting not found');
        }
      }

      return await prisma.meeting.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
        include: {
          User: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          Client: {
            select: {
              uid: true,
            },
          },
          Partner: {
            select: {
              uid: true,
              companyName: true,
            },
          },
          Admin: {
            select: {
              uid: true,
            },
          },
          Project: {
            select: {
              id: true,
              projectName: true,
              projectInformation: true,
            },
          },
        },
      });
    } catch (error: any) {
      console.error('Error in MeetingService.update:', error);
      throw new AppError(500, `Failed to update meeting: ${error.message}`);
    }
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    try {
      // Verify the meeting belongs to the user (unless admin)
      if (!isAdmin) {
        const meeting = await prisma.meeting.findFirst({
          where: {
            id,
            userId,
          },
        });
        
        if (!meeting) {
          throw new AppError(404, 'Meeting not found');
        }
      } else {
        const meeting = await prisma.meeting.findFirst({
          where: { id },
        });
        
        if (!meeting) {
          throw new AppError(404, 'Meeting not found');
        }
      }

      await prisma.meeting.delete({
        where: { id },
      });
    } catch (error: any) {
      console.error('Error in MeetingService.delete:', error);
      throw new AppError(500, `Failed to delete meeting: ${error.message}`);
    }
  }
}

export const meetingService = new MeetingService();

