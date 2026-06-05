import { Router } from 'express';
import healthRoutes from './health.routes';
import landingRequirementRoutes from './landing-requirement.routes';
import landingChatRoutes from './landing-chat.routes';
import supportRoutes from './support.routes';
import adminAuthRoutes from './admin-auth.routes';
import salesLeadRoutes from './sales-lead.routes';
import adminProjectRoutes from './admin-project.routes';
import teamRoutes from './team.routes';
import noteRoutes from './note.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth/admin', adminAuthRoutes);
router.use('/sales-leads', salesLeadRoutes);
router.use('/admin-projects', adminProjectRoutes);
router.use('/teams', teamRoutes);
router.use('/notes', noteRoutes);
router.use('/payments', paymentRoutes);
router.use('/landing-requirements', landingRequirementRoutes);
router.use('/landing-chat', landingChatRoutes);
router.use('/support', supportRoutes);

export default router;
