import { z } from "zod";
import { PAGINATION } from "@/lib/constants";

export const workflowIdSchema = z.object({
  workflowId: z.string().min(1),
});

export const updateWorkflowSchema = z.object({
  workflowId: z.string().min(1),
  name: z.string().min(1),
});

export const workflowPaginationSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export type WorkflowIdSchema = z.infer<typeof workflowIdSchema>;
export type UpdateWorkflowSchema = z.infer<typeof updateWorkflowSchema>;
export type WorkflowPaginationSchema = z.infer<typeof workflowPaginationSchema>;
