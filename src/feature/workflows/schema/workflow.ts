import { z } from "zod";
import { PAGINATION } from "@/lib/constants";

export const workflowIdSchema = z.object({
  workflowId: z.string().min(1),
});

export const updateNameWorkflowSchema = z.object({
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

export const updateWorkflowSchema = z.object({
  id: z.string().min(1),
  nodes: z.array(
    z.object({
      id: z.string().min(1),
      type: z.string().nullish(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      data: z.record(z.string(), z.any()).optional(),
    }),
  ),
  edges: z.array(
    z.object({
      source: z.string().min(1),
      target: z.string().min(1),
      sourceHandle: z.string().nullish(),
      targetHandle: z.string().nullish(),
    }),
  ),
});

export type WorkflowIdSchema = z.infer<typeof workflowIdSchema>;
export type UpdateNameWorkflowSchema = z.infer<typeof updateNameWorkflowSchema>;
export type WorkflowPaginationSchema = z.infer<typeof workflowPaginationSchema>;
export type UpdateWorkflowSchema = z.infer<typeof updateWorkflowSchema>;
