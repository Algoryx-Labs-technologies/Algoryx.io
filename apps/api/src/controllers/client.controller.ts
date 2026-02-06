import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { clientService } from '@/services/client.service';
import { AppError } from '@/types';

export class ClientController {
  async getAllClients(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const clients = await clientService.findAll();

    res.json({
      success: true,
      data: clients,
      count: clients.length,
    });
  }

  async getClientById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const clientId = Array.isArray(id) ? id[0] : id;

    const client = await clientService.findById(clientId);

    if (!client) {
      throw new AppError(404, 'Client not found');
    }

    res.json({
      success: true,
      data: client,
    });
  }
}

export const clientController = new ClientController();
