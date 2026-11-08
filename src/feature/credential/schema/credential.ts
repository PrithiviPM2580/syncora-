import { z } from "zod";
import { CredentialType } from "@/generated/prisma/enums";
import { PAGINATION } from "@/lib/constants";

export const createCredentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

export const credentialIdSchema = z.object({
  credentialId: z.string(),
});

export const updateCredentialSchema = createCredentialSchema.extend({
  credentialId: z.string(),
});

export const getManyCredentialSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export const getByTypeCredentialSchema = z.object({
  type: z.enum(CredentialType),
});

export const credentialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type CredentialIdInput = z.infer<typeof credentialIdSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
export type GetByTypeCredentialInput = z.infer<
  typeof getByTypeCredentialSchema
>;
export type GetManyCredentialInput = z.infer<typeof getManyCredentialSchema>;
export type CredentialFormInput = z.infer<typeof credentialFormSchema>;
