import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  getPosts: baseProcedure.query(async () => {
    const posts = await prisma.post.findMany();
    return posts;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
