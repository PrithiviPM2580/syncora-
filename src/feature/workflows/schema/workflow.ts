import { z } from "zod";

export const workflowIdSchema = z.object({
  workflowId: z.string().min(1),
});

export const updateWorkflowSchema = z.object({
  workflowId: z.string().min(1),
  name: z.string().min(1),
});

export type WorkflowIdSchema = z.infer<typeof workflowIdSchema>;
export type UpdateWorkflowSchema = z.infer<typeof updateWorkflowSchema>;
