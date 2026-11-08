import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/feature/execution/components/http-request/node";
import { GoogleFormTriggerNode } from "@/feature/trigger/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/feature/trigger/components/manual-trigger/node";
import { StripeTriggerNode } from "@/feature/trigger/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma/enums";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
} as const satisfies NodeTypes;

export type NodeComponentType = keyof typeof nodeComponents;
