import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { authService } from '@/services/auth.service';
import { AppError } from '@/types';

/**
 * Webhook controller for Supabase Auth events
 * This handles user creation/updates from Supabase webhooks
 */
export class WebhookController {
  /**
   * Handle Supabase auth webhook events
   * This endpoint should be configured in Supabase Dashboard > Authentication > Webhooks
   */
  async handleAuthWebhook(req: AuthenticatedRequest, res: Response) {
    try {
      const event = req.body;

      // Verify webhook signature if needed (add verification logic here)
      // For now, we'll trust the request if it comes from Supabase

      switch (event.type) {
        case 'user.created':
          // User was created in Supabase Auth
          // Create corresponding user in our database
          await authService.createOrFindUser(
            event.record.id,
            event.record.email,
            {
              firstName: event.record.user_metadata?.firstName,
              lastName: event.record.user_metadata?.lastName,
              phoneNumber: event.record.user_metadata?.phoneNumber,
              country: event.record.user_metadata?.country,
              state: event.record.user_metadata?.state,
              role: event.record.user_metadata?.role || undefined,
            }
          );
          break;

        case 'user.updated':
          // User was updated in Supabase Auth
          // Update corresponding user in our database if needed
          const user = await authService.findBySupabaseUserId(event.record.id);
          if (user) {
            await authService.updateUser(event.record.id, {
              firstName: event.record.user_metadata?.firstName,
              lastName: event.record.user_metadata?.lastName,
              phoneNumber: event.record.user_metadata?.phoneNumber,
              country: event.record.user_metadata?.country,
              state: event.record.user_metadata?.state,
            });
          }
          break;

        case 'user.deleted':
          // User was deleted in Supabase Auth
          // Delete corresponding user in our database
          await authService.deleteUser(event.record.id);
          break;

        default:
          // Unknown event type, just acknowledge
          break;
      }

      res.json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('Webhook error:', error);
      // Still return 200 to prevent Supabase from retrying
      res.status(200).json({
        success: false,
        message: 'Webhook processed with errors',
      });
    }
  }
}

export const webhookController = new WebhookController();
