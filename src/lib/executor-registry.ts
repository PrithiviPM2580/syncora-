import {
  type AnthropicData,
  anthropicExecutor,
} from "@/feature/execution/components/anthropic/executor";
import {
  type GeminiData,
  geminiExecutor,
} from "@/feature/execution/components/gemini/executor";
import {
  type HttpRequestData,
  httpRequestExecutor,
} from "@/feature/execution/components/http-request/executor";
import {
  type OpenaiData,
  openaiExecutor,
} from "@/feature/execution/components/openai/executor";
import type { NodeExecutor } from "@/feature/execution/types";
import {
  type GoogleFormTriggerData,
  googleFormTriggerExecutor,
} from "@/feature/trigger/components/google-form-trigger/executor";
import {
  type ManualTriggerData,
  manualTriggerExecutor,
} from "@/feature/trigger/components/manual-trigger/executor";
import {
  type StripeTriggerData,
  stripeTriggerExecutor,
} from "@/feature/trigger/components/stripe-trigger/executor";
import { NodeType } from "@/generated/prisma/enums";

type NodeDataMap = {
  [NodeType.INITIAL]: ManualTriggerData;
  [NodeType.MANUAL_TRIGGER]: ManualTriggerData;
  [NodeType.HTTP_REQUEST]: HttpRequestData;
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerData;
  [NodeType.STRIPE_TRIGGER]: StripeTriggerData;
  [NodeType.GEMINI]: GeminiData;
  [NodeType.OPENAI]: OpenaiData;
  [NodeType.ANTHROPIC]: AnthropicData;
};

type ExecutorRegistry = {
  [K in keyof NodeDataMap]: NodeExecutor<NodeDataMap[K]>;
};

export const executorRegistry: ExecutorRegistry = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openaiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
};

export const getExecutor = <T extends NodeType>(
  nodeType: T,
): NodeExecutor<NodeDataMap[T]> => {
  return executorRegistry[nodeType];
};
