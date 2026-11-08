import { credentialRouter } from "@/feature/credential/server/router";
import { workflowRouter } from "@/feature/workflows/server/router";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  credentials: credentialRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
