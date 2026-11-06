import {
  type HttpRequestData,
  httpRequestExecutor,
} from "@/feature/execution/components/http-request/executor";
import type { NodeExecutor } from "@/feature/execution/types";
import {
  type ManualTriggerData,
  manualTriggerExecutor,
} from "@/feature/trigger/components/manual-trigger/executor";
import { NodeType } from "@/generated/prisma/enums";

type NodeDataMap = {
  [NodeType.INITIAL]: ManualTriggerData;
  [NodeType.MANUAL_TRIGGER]: ManualTriggerData;
  [NodeType.HTTP_REQUEST]: HttpRequestData;
};

type ExecutorRegistry = {
  [K in keyof NodeDataMap]: NodeExecutor<NodeDataMap[K]>;
};

export const executorRegistry: ExecutorRegistry = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
};

export const getExecutor = <T extends NodeType>(
  nodeType: T,
): NodeExecutor<NodeDataMap[T]> => {
  return executorRegistry[nodeType];
};
