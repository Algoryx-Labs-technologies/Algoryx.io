import { Response } from 'express';
import { randomUUID } from 'crypto';
import { supabase, supabaseAdmin } from '@/config/supabase';
import { env } from '@/config/env';
import { AuthenticatedRequest } from '@/types';
import { authService } from '@/services/auth.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class AuthController {
  /**
   * Sign up a new user
   */
  async signup(req: AuthenticatedRequest, res: Response) {
    const { email, password, firstName, lastName, phoneNumber, country, state, role } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Validate role if provided
    if (role && !['client', 'admin', 'partner'].includes(role)) {
      throw new AppError(400, 'Invalid role. Must be client, admin, or partner');
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          phoneNumber,
          country,
          state,
          role: role || 'client', // Default to client if not specified
        },
      },
    });

    if (authError) {
      throw new AppError(400, authError.message);
    }

    if (!authData.user) {
      throw new AppError(500, 'Failed to create user');
    }

    // Create or find user in database (this will also create Client/Admin/Partner record)
    const user = await authService.createOrFindUser(
      authData.user.id,
      email,
      {
        firstName,
        lastName,
        phoneNumber,
        country,
        state,
        role: role as any || undefined, // Will default to client in service
      }
    );

    // Fetch user with Client relation to return in response
    const userWithClient = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        Client: true,
        Admin: true,
        Partner: true,
      },
    });

    res.json({
      success: true,
      data: {
        user: userWithClient,
        session: authData.session,
      },
      message: 'User created successfully. Please check your email to verify your account.',
    });
  }

  /**
   * Sign in an existing user
   */
  async signin(req: AuthenticatedRequest, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new AppError(401, authError.message);
    }

    if (!authData.user || !authData.session) {
      throw new AppError(500, 'Failed to sign in');
    }

    // Find or create user in database
    const user = await authService.createOrFindUser(
      authData.user.id,
      email,
      {
        firstName: authData.user.user_metadata?.firstName,
        lastName: authData.user.user_metadata?.lastName,
        phoneNumber: authData.user.user_metadata?.phoneNumber,
        country: authData.user.user_metadata?.country,
        state: authData.user.user_metadata?.state,
      }
    );

    res.json({
      success: true,
      data: {
        user,
        session: authData.session,
      },
      message: 'Signed in successfully',
    });
  }

  /**
   * Sign out the current user
   */
  async signout(req: AuthenticatedRequest, res: Response) {
    const authHeader = req.headers?.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await supabase.auth.signOut();
    }

    res.json({
      success: true,
      message: 'Signed out successfully',
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Try to find user, or create if doesn't exist (handles case where user exists in Supabase but not in DB)
    let user = await authService.findBySupabaseUserId(req.supabaseUser.id);

    if (!user) {
      // User exists in Supabase Auth but not in database - create it
      user = await authService.createOrFindUser(
        req.supabaseUser.id,
        req.supabaseUser.email!,
        {
          firstName: req.supabaseUser.user_metadata?.firstName,
          lastName: req.supabaseUser.user_metadata?.lastName,
          phoneNumber: req.supabaseUser.user_metadata?.phoneNumber,
          country: req.supabaseUser.user_metadata?.country,
          state: req.supabaseUser.user_metadata?.state,
          role: req.supabaseUser.user_metadata?.role as any || undefined,
        }
      );
    }

    res.json({
      success: true,
      data: user,
    });
  }

  /**
   * Update current user profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { firstName, lastName, phoneNumber, country, state } = req.body;

    const updatedUser = await authService.updateUser(req.supabaseUser.id, {
      firstName,
      lastName,
      phoneNumber,
      country,
      state,
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  }

  /**
   * Request password reset
   */
  async forgotPassword(req: AuthenticatedRequest, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.CLIENT_URL}/auth/reset-password`,
    });

    if (error) {
      throw new AppError(400, error.message);
    }

    res.json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    });
  }

  /**
   * Reset password with token
   * Note: Password reset is typically handled client-side after user clicks email link.
   * This endpoint is provided for API-based password updates if needed.
   * For standard flow, client should use Supabase client directly after email verification.
   */
  async resetPassword(req: AuthenticatedRequest, res: Response) {
    const { password } = req.body;

    if (!password) {
      throw new AppError(400, 'Password is required');
    }

    if (password.length < 6) {
      throw new AppError(400, 'Password must be at least 6 characters');
    }

    // If user is authenticated (via recovery session), update password
    if (req.supabaseUser && supabaseAdmin) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        req.supabaseUser.id,
        { password }
      );

      if (updateError) {
        throw new AppError(400, updateError.message);
      }

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } else {
      // If not authenticated, this should be handled client-side
      // The client will use the session from the recovery link
      throw new AppError(401, 'Authentication required. Please use the link from your email.');
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(req: AuthenticatedRequest, res: Response) {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError(400, 'Refresh token is required');
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      throw new AppError(401, error.message);
    }

    res.json({
      success: true,
      data: {
        session: data.session,
      },
      message: 'Session refreshed successfully',
    });
  }

  /**
   * Admin-specific sign up
   * Creates a new admin user and Admin record
   */
  async adminSignup(req: AuthenticatedRequest, res: Response) {
    const { email, password, firstName, lastName, phoneNumber, country, state } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          phoneNumber,
          country,
          state,
          role: 'admin',
        },
      },
    });

    if (authError) {
      throw new AppError(400, authError.message);
    }

    if (!authData.user) {
      throw new AppError(500, 'Failed to create user');
    }

    // Create user with admin role and Admin record
    const user = await authService.createOrFindUser(
      authData.user.id,
      email,
      {
        firstName,
        lastName,
        phoneNumber,
        country,
        state,
        role: 'admin' as any,
      }
    );

    // Fetch user with Admin relation to return in response
    const userWithAdmin = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        Admin: true,
      },
    });

    res.json({
      success: true,
      data: {
        user: userWithAdmin,
        session: authData.session,
      },
      message: 'Admin account created successfully. Please check your email to verify your account.',
    });
  }

  /**
   * Admin-specific sign in
   * Validates that the user is an admin
   */
  async adminSignin(req: AuthenticatedRequest, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new AppError(401, authError.message);
    }

    if (!authData.user || !authData.session) {
      throw new AppError(500, 'Failed to sign in');
    }

    // Find or create user in database
    const user = await authService.createOrFindUser(
      authData.user.id,
      email,
      {
        firstName: authData.user.user_metadata?.firstName,
        lastName: authData.user.user_metadata?.lastName,
        phoneNumber: authData.user.user_metadata?.phoneNumber,
        country: authData.user.user_metadata?.country,
        state: authData.user.user_metadata?.state,
      }
    );

    // Verify user is an admin
    if (user.role !== 'admin') {
      throw new AppError(403, 'Access denied. Admin privileges required.');
    }

    // Ensure Admin record exists
    const adminRecord = await prisma.admin.findUnique({
      where: { userId: user.id },
    });

    if (!adminRecord) {
      // Create Admin record if it doesn't exist
      await prisma.admin.create({
        data: {
          uid: randomUUID(),
          userId: user.id,
        },
      });
    }

    // Fetch user with Admin relation
    const userWithAdmin = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        Admin: true,
      },
    });

    res.json({
      success: true,
      data: {
        user: userWithAdmin,
        session: authData.session,
      },
      message: 'Signed in successfully',
    });
  }
}

export const authController = new AuthController();
