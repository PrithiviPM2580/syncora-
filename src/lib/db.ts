import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const globalThisForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaNeon({
  connectionString,
});

const prisma =
  globalThisForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalThisForPrisma.prisma = prisma;
}

export default prisma;
