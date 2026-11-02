import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  updateWorkflowSchema,
  workflowIdSchema,
  workflowPaginationSchema,
} from "../schema/workflow";

export const workflowRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const slug = generateSlug(3);
    return prisma.workflow.create({
      data: {
        name: slug,
        userId: ctx.auth.user.id,
      },
    });
  }),
  remove: protectedProcedure
    .input(workflowIdSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(updateWorkflowSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.update({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getOne: protectedProcedure
    .input(workflowIdSchema)
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getMany: protectedProcedure
    .input(workflowPaginationSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
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
        prisma.workflow.count({
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
});
