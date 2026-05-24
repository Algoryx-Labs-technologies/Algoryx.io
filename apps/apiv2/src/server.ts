import 'dotenv/config';
import { createApp } from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { logger } from '@/utils/logger';

const app = createApp();
const PORT = parseInt(env.PORT, 10);

const startServer = async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await connectDatabase();
  } catch (error) {
    logger.error('Failed to connect to MongoDB. Server will not start.', error);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`API: http://localhost:${PORT}/api/${env.API_VERSION}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled Promise Rejection:', error);
    process.exit(1);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
};

await startServer();
