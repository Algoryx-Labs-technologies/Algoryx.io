import { Router } from 'express';
import healthRoutes from './health.routes';
import landingRequirementRoutes from './landing-requirement.routes';
import landingChatRoutes from './landing-chat.routes';
import supportRoutes from './support.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/landing-requirements', landingRequirementRoutes);
router.use('/landing-chat', landingChatRoutes);
router.use('/support', supportRoutes);

export default router;
