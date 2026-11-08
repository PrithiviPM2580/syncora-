import { z } from "zod";

export const httpRequestFormSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  endpoint: z.string("Please enter a valid URL").min(1, "Endpoint is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export const geminiFormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
    }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export const openaiFormSchema = geminiFormSchema;
export const anthropicFormSchema = geminiFormSchema;

export type HttpRequestFormData = z.infer<typeof httpRequestFormSchema>;
export type GeminiFormData = z.infer<typeof geminiFormSchema>;
export type OpenaiFormData = z.infer<typeof openaiFormSchema>;
export type AnthropicFormData = z.infer<typeof anthropicFormSchema>;
