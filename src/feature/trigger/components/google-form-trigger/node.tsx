"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/feature/execution/hooks/use-node-status";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: googleFormTriggerChannel,
    topics: ["status"],
    token: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleSettingsClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <GoogleFormTriggerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus.status}
        onSettings={handleSettingsClick}
        onDoubleClick={handleSettingsClick}
      />
    </>
  );
});
