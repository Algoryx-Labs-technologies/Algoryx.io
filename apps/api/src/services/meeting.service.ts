import { prisma } from '@/config/database';
import { Meeting, MeetingParticipant, MeetingType, MeetingStatus } from '@prisma/client';
import { AppError } from '@/types';

export class MeetingService {
  async findAll(userId: string, isAdmin: boolean = false): Promise<Meeting[]> {
    const where: any = isAdmin ? {} : { userId };
    
    return prisma.meeting.findMany({
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
            description: true,
          },
        },
        participants: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findUpcoming(userId: string, isAdmin: boolean = false): Promise<Meeting[]> {
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
    
    return prisma.meeting.findMany({
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
            description: true,
          },
        },
        participants: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findById(id: string, userId: string, isAdmin: boolean = false): Promise<Meeting | null> {
    const where: any = { id };
    if (!isAdmin) {
      where.userId = userId;
    }

    return prisma.meeting.findFirst({
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
            description: true,
          },
        },
        participants: true,
      },
    });
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
    participants?: Array<{ email: string; name?: string; role?: string }>;
    googleEventId?: string;
    syncedWithGoogle?: boolean;
  }): Promise<Meeting> {
    const { participants, ...meetingData } = data;

    const meeting = await prisma.meeting.create({
      data: meetingData,
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
            description: true,
          },
        },
        participants: true,
      },
    });

    // Create participants if provided
    if (participants && participants.length > 0) {
      await prisma.meetingParticipant.createMany({
        data: participants.map(p => ({
          meetingId: meeting.id,
          email: p.email,
          name: p.name,
          role: p.role || 'attendee',
        })),
      });
    }

    // Fetch meeting with participants
    return this.findById(meeting.id, data.userId, false) as Promise<Meeting>;
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

    return prisma.meeting.update({
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
            description: true,
          },
        },
        participants: true,
      },
    });
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
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
  }

  async addParticipant(
    meetingId: string,
    participant: { email: string; name?: string; role?: string }
  ): Promise<MeetingParticipant> {
    // Verify meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new AppError(404, 'Meeting not found');
    }

    return prisma.meetingParticipant.create({
      data: {
        meetingId,
        email: participant.email,
        name: participant.name,
        role: participant.role || 'attendee',
      },
    });
  }

  async removeParticipant(meetingId: string, participantId: string): Promise<void> {
    await prisma.meetingParticipant.delete({
      where: { id: participantId },
    });
  }
}

export const meetingService = new MeetingService();

