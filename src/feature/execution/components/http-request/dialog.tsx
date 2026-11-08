"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  type HttpRequestFormData,
  httpRequestFormSchema,
} from "../../schema/execution";

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HttpRequestFormData) => void;
  defaultValues?: Partial<HttpRequestFormData>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: HttpRequestDialogProps) => {
  const form = useForm<HttpRequestFormData>({
    resolver: zodResolver(httpRequestFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myApiCall";
  const watchedMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchedMethod);

  const handleSubmitForm = (data: HttpRequestFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP request node.
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
                    placeholder="myApiCall"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.httpResponse.data}}`}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="method"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-method">Method</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-demo-method"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    The HTTP method to use for the request.
                  </FieldDescription>
                </Field>
              )}
            />
            <Controller
              name="endpoint"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-endpoint">
                    Endpoint URL
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-endpoint"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variables}}"} to stringify objects.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {showBodyField && (
              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-body">
                      Request Body
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id="form-rhf-demo-body"
                      placeholder={
                        '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                      }
                      className="min-h-[120px] font-mono text-sm"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      JSON with template variables. Use {"{{variables}}"} for
                      simple values or {"{{json variable}}"} to stringify
                      objects
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
