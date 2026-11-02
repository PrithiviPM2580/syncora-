import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { useTRPC } from "@/trpc/client";
import { useWorkflowParams } from "./use-workflow-params";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Workflow ${data.name} created successfully`,
        });
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: `Error creating workflow: ${error.message}`,
        });
      },
    }),
  );
};

export const useRemoveWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.add({
          type: "success",
          description: `Workflow ${data.name} removed successfully`,
        });
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ workflowId: data.id }),
        );
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: `Error removing workflow: ${error.message}`,
        });
      },
    }),
  );
};
