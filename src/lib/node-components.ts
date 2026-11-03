import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/feature/execution/components/http-request/node";
import { ManualTriggerNode } from "@/feature/trigger/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma/enums";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;
