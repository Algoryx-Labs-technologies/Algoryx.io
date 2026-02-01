import { randomUUID } from 'crypto';
import { prisma } from '@/config/database';
import { supabaseAdmin } from '@/config/supabase';
import { User, Role } from '@prisma/client';
import { AppError } from '@/types';

export class AuthService {
  /**
   * Create or find user in database after Supabase auth signup
   */
  async createOrFindUser(
    supabaseUserId: string,
    email: string,
    metadata?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      country?: string;
      state?: string;
      role?: Role;
    }
  ): Promise<User> {
    // Check if user already exists by supabaseUserId
    let user = await prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (user) {
      return user;
    }

    // Check if user exists by email
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      // Update existing user with supabaseUserId
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { supabaseUserId },
      });
      return user;
    }

    // Create new user
    const nameParts = metadata?.firstName || metadata?.lastName
      ? {
          firstName: metadata.firstName,
          lastName: metadata.lastName,
        }
      : {};

    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        supabaseUserId,
        email,
        role: metadata?.role || Role.client,
        phoneNumber: metadata?.phoneNumber,
        country: metadata?.country,
        state: metadata?.state,
        ...nameParts,
      },
    });

    // Create role-specific records based on user role (if they don't exist)
    if (user.role === Role.client) {
      const existingClient = await prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!existingClient) {
        await prisma.client.create({
          data: {
            uid: randomUUID(),
            userId: user.id,
          },
        });
      }
    } else if (user.role === Role.admin) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { userId: user.id },
      });
      if (!existingAdmin) {
        await prisma.admin.create({
          data: {
            uid: randomUUID(),
            userId: user.id,
          },
        });
      }
    } else if (user.role === Role.partner) {
      const existingPartner = await prisma.partner.findUnique({
        where: { userId: user.id },
      });
      if (!existingPartner) {
        await prisma.partner.create({
          data: {
            uid: randomUUID(),
            userId: user.id,
          },
        });
      }
    }

    return user;
  }

  /**
   * Find user by Supabase user ID
   */
  async findBySupabaseUserId(supabaseUserId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { supabaseUserId },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email },
    });
  }

  /**
   * Update user profile
   */
  async updateUser(
    supabaseUserId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      country?: string;
      state?: string;
    }
  ): Promise<User> {
    const user = await this.findBySupabaseUserId(supabaseUserId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  /**
   * Delete user account (cascade delete handled by Prisma)
   */
  async deleteUser(supabaseUserId: string): Promise<void> {
    const user = await this.findBySupabaseUserId(supabaseUserId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Delete from Supabase Auth (requires admin client)
    if (supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
    }

    // Delete from database (cascade will handle related records)
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
}

export const authService = new AuthService();
