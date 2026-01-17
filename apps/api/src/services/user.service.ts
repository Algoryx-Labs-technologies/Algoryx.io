import { prisma } from '@/config/database';
import { User } from '@prisma/client';
import { AppError } from '@/types';

export class UserService {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; name?: string; avatarUrl?: string }): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userService = new UserService();

