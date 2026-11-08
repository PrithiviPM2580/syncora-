"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { useNodeStatus } from "../../hooks/use-node-status";
import type { AnthropicFormData } from "../../schema/execution";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchAnthropicRealtimeToken } from "./actions";
import { AnthropicDialog } from "./dialog";

type AnthropicNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: anthropicChannel,
    topics: ["status"],
    token: fetchAnthropicRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: AnthropicFormData) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `anthropic-3.5-sonnet: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/anthropic.svg"
        name="Anthropic"
        status={nodeStatus.status}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={() => handleOpenSettings}
      />
    </>
  );
});
