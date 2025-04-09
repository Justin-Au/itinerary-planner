  import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Determine which database to use based on environment
const getDatabaseUrl = (): string => {
  // For mobile environments, use SQLite
  if (process.env.NODE_ENV === 'mobile') {
    return process.env.DATABASE_URL_SQLITE || 'file:./dev.db';
  }
  
  // Default to PostgreSQL for web and other environments
  return process.env.DATABASE_URL || '';
};

// Create a global prisma instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['query', 'error', 'warn'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
