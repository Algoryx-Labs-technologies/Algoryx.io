import { Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/types';
import { prisma } from '@/config/database';
import { projectService } from '@/services/project.service';
import { clientService } from '@/services/client.service';

export class AdminController {
  async getAdminId(userId: string): Promise<string | null> {
    const admin = await prisma.admin.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return admin?.uid || null;
  }

  // ========== PROJECT MANAGEMENT ==========
  async getAllProjects(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    // Optional filter by userId (clientId, partnerId, or adminId)
    const { userId } = req.query;
    const where: any = {};

    if (userId) {
      // Find if userId is a client, partner, or admin
      const client = await prisma.client.findUnique({
        where: { userId: userId as string },
        select: { uid: true },
      });
      const partner = await prisma.partner.findUnique({
        where: { userId: userId as string },
        select: { uid: true },
      });
      const admin = await prisma.admin.findUnique({
        where: { userId: userId as string },
        select: { uid: true },
      });

      if (client) {
        where.clientId = client.uid;
      } else if (partner) {
        where.partnerId = partner.uid;
      } else if (admin) {
        where.adminId = admin.uid;
      }
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        Client: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
              },
            },
          },
        },
        Partner: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Admin: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  }

  async createProject(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const adminId = await this.getAdminId(req.user.id);
    if (!adminId) {
      throw new AppError(404, 'Admin profile not found');
    }

    // Normalize clientId and partnerId - convert empty strings to null
    let clientId: string | null = null;
    let partnerId: string | null = null;

    // Validate and set clientId if provided (strict validation - client must exist)
    if (req.body.clientId && req.body.clientId.trim() !== '') {
      const clientExists = await prisma.client.findUnique({
        where: { uid: req.body.clientId },
      });
      if (!clientExists) {
        throw new AppError(400, `Client with ID ${req.body.clientId} not found`);
      }
      clientId = req.body.clientId;
    }

    // Validate and set partnerId if provided (forgiving - if invalid, just set to null)
    if (req.body.partnerId && req.body.partnerId.trim() !== '') {
      const partnerExists = await prisma.partner.findUnique({
        where: { uid: req.body.partnerId },
      });
      if (partnerExists) {
        partnerId = req.body.partnerId;
      }
      // If partner doesn't exist, just leave partnerId as null (don't throw error)
    }

    const project = await prisma.project.create({
      data: {
        id: randomUUID(),
        adminId,
        clientId,
        partnerId,
        projectName: req.body.projectName,
        readMe: req.body.readMe,
        techStack: req.body.techStack,
        clientRequirement: req.body.clientRequirement,
        projectTimeline: req.body.projectTimeline,
        projectStatus: req.body.projectStatus,
        projectFeatures: req.body.projectFeatures,
        priority: req.body.priority,
        progressStatus: req.body.progressStatus,
        Budget: req.body.Budget,
        paymentStatus: req.body.paymentStatus,
      },
      include: {
        Client: true,
        Partner: true,
        Admin: true,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  }

  async updateProject(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const projectId = Array.isArray(id) ? id[0] : id;
    const adminId = await this.getAdminId(req.user.id);
    if (!adminId) {
      throw new AppError(404, 'Admin profile not found');
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // Prepare update data, handling empty strings for foreign keys
    const updateData: any = {
      ...req.body,
      updated_at: new Date(),
    };

    // Normalize clientId - convert empty strings to null
    if ('clientId' in req.body) {
      const clientIdValue = Array.isArray(req.body.clientId) ? req.body.clientId[0] : req.body.clientId;
      if (clientIdValue && typeof clientIdValue === 'string' && clientIdValue.trim() !== '') {
        const clientExists = await prisma.client.findUnique({
          where: { uid: clientIdValue },
        });
        if (!clientExists) {
          throw new AppError(400, `Client with ID ${clientIdValue} not found`);
        }
        updateData.clientId = clientIdValue;
      } else {
        updateData.clientId = null;
      }
    }

    // Normalize partnerId - convert empty strings to null (forgiving - if invalid, just set to null)
    if ('partnerId' in req.body) {
      const partnerIdValue = Array.isArray(req.body.partnerId) ? req.body.partnerId[0] : req.body.partnerId;
      if (partnerIdValue && typeof partnerIdValue === 'string' && partnerIdValue.trim() !== '') {
        const partnerExists = await prisma.partner.findUnique({
          where: { uid: partnerIdValue },
        });
        if (partnerExists) {
          updateData.partnerId = partnerIdValue;
        } else {
          // If partner doesn't exist, just set to null (don't throw error)
          updateData.partnerId = null;
        }
      } else {
        updateData.partnerId = null;
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        Client: true,
        Partner: true,
        Admin: true,
      },
    });

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  }

  async deleteProject(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const projectId = Array.isArray(id) ? id[0] : id;
    const adminId = await this.getAdminId(req.user.id);
    if (!adminId) {
      throw new AppError(404, 'Admin profile not found');
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  }

  // ========== NOTIFICATION MANAGEMENT ==========
  async createNotification(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const notification = await prisma.notification.create({
      data: {
        id: randomUUID(),
        title: req.body.title,
        message: req.body.message,
        type: req.body.type || 'info',
        userId: req.body.userId || null,
      },
      include: {
        User: true,
      },
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully',
    });
  }

  // ========== PAYMENT MANAGEMENT ==========
  async createPayment(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const payment = await prisma.payment.create({
      data: {
        id: randomUUID(),
        userId: req.body.userId || null,
        clientId: req.body.clientId || null,
        projectId: req.body.projectId || null,
        amount: req.body.amount,
        currency: req.body.currency || 'USD',
        status: req.body.status || 'pending',
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId,
        description: req.body.description,
        metadata: req.body.metadata,
      },
      include: {
        User: true,
        Project: true,
      },
    });

    // Update project payment status if projectId is provided
    if (req.body.projectId && req.body.status === 'paid') {
      await prisma.project.update({
        where: { id: req.body.projectId },
        data: { paymentStatus: 'paid' },
      });
    }

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully',
    });
  }

  // ========== SUPPORT TICKET REPLY ==========
  async replyToTicket(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { ticketId } = req.params;
    const ticketUid = Array.isArray(ticketId) ? ticketId[0] : ticketId;

    const ticket = await prisma.supportTicket.findUnique({
      where: { uid: ticketUid },
    });

    if (!ticket) {
      throw new AppError(404, 'Support ticket not found');
    }

    // Generate unique ID for the reply
    const replyId = randomUUID();

    const reply = await prisma.ticketReply.create({
      data: {
        id: replyId,
        ticketId: ticket.uid,
        reply: req.body.reply,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    // Update ticket status if provided
    if (req.body.status) {
      await prisma.supportTicket.update({
        where: { uid: ticketUid },
        data: { status: req.body.status },
      });
    }

    res.status(201).json({
      success: true,
      data: reply,
      message: 'Reply added successfully',
    });
  }

  // ========== COMMUNITY MANAGEMENT ==========
  async createCommunityPost(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const communityPost = await prisma.community.create({
      data: {
        id: randomUUID(),
        title: req.body.title,
        content: req.body.content,
        authorId: req.user.id,
        category: req.body.category,
        tags: req.body.tags || [],
        isPinned: req.body.isPinned || false,
      },
    });

    res.status(201).json({
      success: true,
      data: communityPost,
      message: 'Community post created successfully',
    });
  }

  // ========== FEEDBACK MANAGEMENT ==========
  async selectTopFeedback(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { feedbackId } = req.params;
    const feedbackUid = Array.isArray(feedbackId) ? feedbackId[0] : feedbackId;
    const { isTop } = req.body;

    const feedback = await prisma.feedback.findUnique({
      where: { uid: feedbackUid },
    });

    if (!feedback) {
      throw new AppError(404, 'Feedback not found');
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { uid: feedbackUid },
      data: { isTopFeedback: isTop !== undefined ? isTop : true },
    });

    res.json({
      success: true,
      data: updatedFeedback,
      message: `Feedback ${isTop ? 'marked as' : 'unmarked from'} top feedback`,
    });
  }

  // ========== REQUIREMENT MANAGEMENT ==========
  async markRequirementContacted(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { requirementId } = req.params;
    const requirementUid = Array.isArray(requirementId) ? requirementId[0] : requirementId;

    const requirement = await prisma.requirement.findUnique({
      where: { uid: requirementUid },
    });

    if (!requirement) {
      throw new AppError(404, 'Requirement not found');
    }

    const updatedRequirement = await prisma.requirement.update({
      where: { uid: requirementUid },
      data: { status: 'Contacted' },
    });

    res.json({
      success: true,
      data: updatedRequirement,
      message: 'Requirement marked as contacted',
    });
  }

  async markRequirementRejected(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { requirementId } = req.params;
    const requirementUid = Array.isArray(requirementId) ? requirementId[0] : requirementId;

    const requirement = await prisma.requirement.findUnique({
      where: { uid: requirementUid },
    });

    if (!requirement) {
      throw new AppError(404, 'Requirement not found');
    }

    const updatedRequirement = await prisma.requirement.update({
      where: { uid: requirementUid },
      data: { status: 'Rejected' },
    });

    res.json({
      success: true,
      data: updatedRequirement,
      message: 'Requirement marked as rejected',
    });
  }

  // ========== QnA MANAGEMENT ==========
  async replyToQnA(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { qnaId } = req.params;
    const qnaIdString = Array.isArray(qnaId) ? qnaId[0] : qnaId;

    const qna = await prisma.qnA.findUnique({
      where: { id: qnaIdString },
    });

    if (!qna) {
      throw new AppError(404, 'QnA not found');
    }

    const answer = await prisma.qnAAnswer.create({
      data: {
        id: randomUUID(),
        qnaId: qna.id,
        answer: req.body.answer,
        userId: req.user.id,
        isAccepted: req.body.isAccepted || false,
      },
    });

    // Update QnA as answered (store answer in QnA model as well)
    await prisma.qnA.update({
      where: { id: qnaIdString },
      data: { 
        isAnswered: true,
        answer: req.body.answer,
      },
    });

    res.status(201).json({
      success: true,
      data: answer,
      message: 'Answer added successfully',
    });
  }

  // ========== GET ALL USERS ==========
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const users = await prisma.user.findMany({
      include: {
        Client: {
          select: { uid: true },
        },
        Admin: {
          select: { uid: true },
        },
        Partner: {
          select: { uid: true, companyName: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  }

  // ========== GET ALL CLIENTS ==========
  async getAllClients(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const clients = await clientService.findAll();

    res.json({
      success: true,
      data: clients,
      count: clients.length,
    });
  }

  // ========== GET LANDING REQUIREMENTS ==========
  async getLandingRequirements(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const enquiries = await prisma.landingEnquiry.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length,
    });
  }

  // ========== GET LANDING ENQUIRIES ==========
  async getLandingEnquiries(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const enquiries = await prisma.landingEnquiry.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: enquiries,
      count: enquiries.length,
    });
  }

  // ========== GET CLIENT REQUIREMENTS ==========
  async getClientRequirements(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const requirements = await prisma.requirement.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Partner: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: requirements,
      count: requirements.length,
    });
  }

  // ========== GET CLIENT SUPPORT TICKETS ==========
  async getClientSupportTickets(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const tickets = await prisma.supportTicket.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Partner: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        TicketReply: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: tickets,
      count: tickets.length,
    });
  }

  // ========== UPDATE SUPPORT TICKET ==========
  async updateSupportTicket(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { ticketId } = req.params;
    const ticketUid = Array.isArray(ticketId) ? ticketId[0] : ticketId;
    const { status, priority, issueType, description, additionalDetails } = req.body;

    // Validate status if provided
    if (status && !['pending', 'in_progress', 'resolved', 'closed'].includes(status)) {
      throw new AppError(400, 'Invalid status. Must be pending, in_progress, resolved, or closed');
    }

    // Validate priority if provided
    if (priority && !['low', 'mid', 'high'].includes(priority)) {
      throw new AppError(400, 'Invalid priority. Must be low, mid, or high');
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (issueType !== undefined) updateData.issueType = issueType;
    if (description !== undefined) updateData.description = description;
    if (additionalDetails !== undefined) updateData.additionalDetails = additionalDetails;

    const ticket = await prisma.supportTicket.update({
      where: { uid: ticketUid },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Partner: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        TicketReply: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    res.json({
      success: true,
      data: ticket,
      message: 'Support ticket updated successfully',
    });
  }

  // ========== GET FEEDBACK ==========
  async getFeedback(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        Partner: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: feedbacks,
      count: feedbacks.length,
    });
  }

  // ========== GET PAYMENTS ==========
  async getPayments(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const payments = await prisma.payment.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  }

  // ========== UPDATE PAYMENT ==========
  async updatePayment(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const paymentId = Array.isArray(id) ? id[0] : id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...req.body,
        updated_at: new Date(),
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
    });

    // Update project payment status if projectId is provided and status is paid
    if (updatedPayment.projectId && updatedPayment.status === 'paid') {
      await prisma.project.update({
        where: { id: updatedPayment.projectId },
        data: { paymentStatus: 'paid' },
      });
    }

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Payment updated successfully',
    });
  }

  // ========== GET ALL NOTIFICATIONS ==========
  async getAllNotifications(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const notifications = await prisma.notification.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  }

  // ========== GET COMMUNITY ==========
  async getCommunity(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const communityPosts = await prisma.community.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: communityPosts,
      count: communityPosts.length,
    });
  }

  // ========== GET QnA ==========
  async getQnA(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const qnas = await prisma.qnA.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        QnAAnswer: {
          include: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: qnas,
      count: qnas.length,
    });
  }
}

export const adminController = new AdminController();
