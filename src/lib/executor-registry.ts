import {
  type HttpRequestData,
  httpRequestExecutor,
} from "@/feature/execution/components/http-request/executor";
import type { NodeExecutor } from "@/feature/execution/types";
import {
  type GoogleFormTriggerData,
  googleFormTriggerExecutor,
} from "@/feature/trigger/components/google-form-trigger/executor";
import {
  type ManualTriggerData,
  manualTriggerExecutor,
} from "@/feature/trigger/components/manual-trigger/executor";
import { NodeType } from "@/generated/prisma/enums";

type NodeDataMap = {
  [NodeType.INITIAL]: ManualTriggerData;
  [NodeType.MANUAL_TRIGGER]: ManualTriggerData;
  [NodeType.HTTP_REQUEST]: HttpRequestData;
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerData;
};

type ExecutorRegistry = {
  [K in keyof NodeDataMap]: NodeExecutor<NodeDataMap[K]>;
};

export const executorRegistry: ExecutorRegistry = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export const getExecutor = <T extends NodeType>(
  nodeType: T,
): NodeExecutor<NodeDataMap[T]> => {
  return executorRegistry[nodeType];
};
