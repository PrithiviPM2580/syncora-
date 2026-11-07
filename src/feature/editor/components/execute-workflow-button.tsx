import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/feature/workflows/hooks/use-workflows";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecuteWorkflow = () => {
    executeWorkflow.mutate({ workflowId: workflowId });
  };

  return (
    <Button
      onClick={handleExecuteWorkflow}
      disabled={executeWorkflow.isPending}
    >
      <FlaskConicalIcon className="mr-2 h-4 w-4" />
      {executeWorkflow.isPending ? "Executing..." : "Execute Workflow"}
    </Button>
  );
};
