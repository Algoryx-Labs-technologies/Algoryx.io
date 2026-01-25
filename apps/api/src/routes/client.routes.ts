import { Router } from 'express';
import { clientController } from '@/controllers/client.controller';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Routes
router.get('/', authenticate, clientController.getAllClients.bind(clientController));
router.get('/:id', authenticate, clientController.getClientById.bind(clientController));

export default router;
