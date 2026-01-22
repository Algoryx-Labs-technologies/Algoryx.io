import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/database';

const app = createApp();
const PORT = parseInt(env.PORT);

// Test database connection
const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connection established successfully');
    
    // Test query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database query test passed');
    
    return true;
  } catch (error: any) {
    logger.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  // Close Prisma connection
  await prisma.$disconnect();
  logger.info('✅ Database connection closed');
  
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
let server: ReturnType<typeof app.listen> | null = null;

process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled Promise Rejection:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server with database connection check
const startServer = async () => {
  // Test database connection before starting server
  logger.info('🔌 Testing database connection...');
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    logger.error('❌ Failed to connect to database. Server will not start.');
    process.exit(1);
  }
  
  // Start server
  server = app.listen(PORT, () => {
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 API: http://localhost:${PORT}/api/${env.API_VERSION}`);
    logger.info(`💾 Database: Connected`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
  
  return server;
};

await startServer();
