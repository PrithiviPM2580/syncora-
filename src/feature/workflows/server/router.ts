import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { updateWorkflowSchema, workflowIdSchema } from "../schema/workflow";

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

  getMany: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
});
