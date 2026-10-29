import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
export const appRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.auth.user.id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
