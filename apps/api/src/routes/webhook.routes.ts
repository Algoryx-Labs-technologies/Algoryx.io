import { Router } from 'express';
import { webhookController } from '@/controllers/webhook.controller';

const router = Router();

// Webhook endpoint for Supabase Auth events
// This should be configured in Supabase Dashboard > Authentication > Webhooks
// URL: https://your-api.com/api/v1/webhooks/auth
router.post(
  '/auth',
  webhookController.handleAuthWebhook.bind(webhookController)
);

export default router;
