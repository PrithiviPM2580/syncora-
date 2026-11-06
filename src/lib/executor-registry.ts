import { httpRequestExecutor } from "@/feature/execution/components/http-request/executor";
import type { NodeExecutor } from "@/feature/execution/types";
import { manualTriggerExecutor } from "@/feature/trigger/components/manual-trigger/executor";
import { NodeType } from "@/generated/prisma/enums";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor not found for node type: ${nodeType}`);
  }
  return executor;
};
