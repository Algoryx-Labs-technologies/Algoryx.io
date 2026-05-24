import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

/** mongodb+srv needs SRV DNS; some local resolvers refuse or block querySrv. */
function configureDnsForSrv(uri: string): void {
  if (!uri.startsWith('mongodb+srv://')) return;

  const servers = env.MONGODB_DNS_SERVERS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!servers?.length) return;

  dns.setServers(servers);
  logger.info(`Using DNS servers for mongodb+srv: ${servers.join(', ')}`);
}

export const connectDatabase = async (): Promise<void> => {
  configureDnsForSrv(env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI);
  logger.info(`MongoDB connected (database: ${mongoose.connection.name})`);
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
