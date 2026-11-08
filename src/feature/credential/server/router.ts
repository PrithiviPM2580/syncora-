import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  createCredentialSchema,
  credentialIdSchema,
  getByTypeCredentialSchema,
  getManyCredentialSchema,
  updateCredentialSchema,
} from "../schema/credential";

export const credentialRouter = createTRPCRouter({
  create: premiumProcedure
    .input(createCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, type, value } = input;

      return prisma.credential.create({
        data: {
          name,
          type,
          value,
          userId: ctx.auth.user.id,
        },
      });
    }),
  remove: protectedProcedure
    .input(credentialIdSchema)
    .mutation(async ({ input, ctx }) => {
      return prisma.credential.delete({
        where: {
          id: input.credentialId,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(updateCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const { credentialId, name, type, value } = input;

      return prisma.credential.update({
        where: {
          id: credentialId,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          type,
          value,
        },
      });
    }),
  getOne: protectedProcedure
    .input(credentialIdSchema)
    .query(async ({ input, ctx }) => {
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.credentialId,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getMany: protectedProcedure
    .input(getManyCredentialSchema)
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  getByType: protectedProcedure
    .input(getByTypeCredentialSchema)
    .query(async ({ input, ctx }) => {
      const { type } = input;

      return prisma.credential.findMany({
        where: {
          userId: ctx.auth.user.id,
          type,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
