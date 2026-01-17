import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { userService } from '@/services/user.service';
import { AppError } from '@/types';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await userService.findByEmail(req.supabaseUser.email!);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await userService.findByEmail(req.supabaseUser.email!);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updatedUser = await userService.update(user.id, req.body);

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  }
}

export const userController = new UserController();

