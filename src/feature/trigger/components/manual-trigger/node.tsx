"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSettingsClick = () => {
    setIsDialogOpen(true);
  };

  const nodeStatus = "initial";
  return (
    <>
      <ManualTriggerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        status={nodeStatus}
        onSettings={handleSettingsClick}
        onDoubleClick={handleSettingsClick}
      />
    </>
  );
});
