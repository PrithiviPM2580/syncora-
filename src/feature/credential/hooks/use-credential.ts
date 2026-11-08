import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import type { CredentialType } from "@/generated/prisma/enums";
import { useTRPC } from "@/trpc/client";
import { useCredentialParams } from "./use-credential-params";

export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialParams();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

export const useSuspenseCredential = (credentialId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ credentialId }),
  );
};

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Credential ${data.name} created successfully`,
        });
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: `Error creating credential: ${error.message}`,
        });
      },
    }),
  );
};

export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Credential ${data.name} updated successfully`,
        });
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ credentialId: data.id }),
        );
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: `Error updating credential: ${error.message}`,
        });
      },
    }),
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Credential ${data.name} removed successfully`,
        });
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ credentialId: data.id }),
        );
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: `Error removing credential: ${error.message}`,
        });
      },
    }),
  );
};

export const useCredentialByType = (type: CredentialType) => {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
