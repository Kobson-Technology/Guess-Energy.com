import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma partagé entre les fonctions serverless Vercel
 * (évite de créer une connexion SQL à chaque invocation).
 * En développement le client est réutilisé via globalThis (hot-reload).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;