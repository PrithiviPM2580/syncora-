"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialByType } from "@/feature/credential/hooks/use-credential";
import { CredentialType } from "@/generated/prisma/enums";
import { type GeminiFormData, geminiFormSchema } from "../../schema/execution";

interface GeminiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GeminiFormData) => void;
  defaultValues?: Partial<GeminiFormData>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: GeminiDialogProps) => {
  const { data: credentials, isPending } = useCredentialByType(
    CredentialType.GEMINI,
  );
  const form = useForm<GeminiFormData>({
    resolver: zodResolver(geminiFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      credentialId: defaultValues.credentialId || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myGemini";

  const handleSubmitForm = (data: GeminiFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmitForm)}>
          <FieldGroup>
            <Controller
              name="variableName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-variableName">
                    Variable Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-variableName"
                    placeholder="myGemini"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="credentialId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-credentialId">
                    Gemini Credential
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      isPending || !credentials || credentials.length === 0
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logos/gemini.svg"
                              alt="Gemini"
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="systemPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-systemPrompt">
                    System Prompt (Optional)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-systemPrompt"
                    aria-invalid={fieldState.invalid}
                    placeholder="You are a helpful assistant."
                    className="min-h-[80px] font-mono text-sm"
                  />
                  <FieldDescription>
                    Sets the behavior of the assistant. Use {"{{variables}}"}{" "}
                    for simple values or {"{{json variable}}"} to stringify
                    objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="userPrompt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-userPrompt">
                    User Prompt
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-userPrompt"
                    aria-invalid={fieldState.invalid}
                    placeholder="Summarize this text: {{json httpResponse.data}}"
                    className="min-h-[80px] font-mono text-sm"
                  />
                  <FieldDescription>
                    The prompt to send to the AI. Use {"{{variables}}"} for
                    simple values or {"{{json variable}}"} to stringify objects
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
