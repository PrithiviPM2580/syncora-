"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/feature/execution/hooks/use-node-status";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: stripeTriggerChannel,
    topics: ["status"],
    token: fetchStripeTriggerRealtimeToken,
  });

  const handleSettingsClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <StripeTriggerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/stripe.svg"
        name="Stripe"
        description="When a Stripe event is captured"
        status={nodeStatus.status}
        onSettings={handleSettingsClick}
        onDoubleClick={handleSettingsClick}
      />
    </>
  );
});
