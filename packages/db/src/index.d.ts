import { PrismaClient } from '@prisma/client';

declare module 'db' {
  export const prisma: PrismaClient;
  export * from '@prisma/client';
}
