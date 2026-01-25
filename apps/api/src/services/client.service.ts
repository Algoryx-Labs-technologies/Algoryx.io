import { prisma } from '@/config/database';
import { Client } from '@prisma/client';

export class ClientService {
  async findAll(): Promise<Client[]> {
    return prisma.client.findMany({
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            country: true,
            state: true,
            role: true,
            created_at: true,
          },
        },
      },
      orderBy: {
        uid: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { uid: id },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            country: true,
            state: true,
            role: true,
            created_at: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { userId },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            country: true,
            state: true,
            role: true,
            created_at: true,
          },
        },
      },
    });
  }
}

export const clientService = new ClientService();
