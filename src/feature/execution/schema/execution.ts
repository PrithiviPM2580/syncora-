import { z } from "zod";

export const exectionFormSchema = z.object({
  endpoint: z.url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export type ExecutionFormData = z.infer<typeof exectionFormSchema>;
