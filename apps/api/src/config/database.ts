import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure connection pool settings
// For Supabase, connection pooling is handled via the connection string
// Add these query parameters to your DATABASE_URL for better concurrent handling:
// ?connection_limit=10&pool_timeout=20&connect_timeout=10
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Error formatting for better debugging
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing Prisma connection...`);
  try {
    await prisma.$disconnect();
    console.log('Prisma connection closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error during Prisma disconnection:', error);
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled promise rejections (like Prisma errors)
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
  // This prevents crashes from unhandled Prisma errors
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // For Prisma errors, we want to continue running
  // Only exit for critical errors
  if (!error.message.includes('prisma') && !error.message.includes('Prisma')) {
    process.exit(1);
  }
});

