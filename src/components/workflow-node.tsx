"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

interface WorkflowNodeProps {
  children: React.ReactNode;
  name?: string;
  description?: string;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
}

export const WorkflowNode = ({
  children,
  name,
  description,
  showToolbar = true,
  onDelete,
  onSettings,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button size="sm" variant="ghost" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px]"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-sm truncate text-muted-foreground">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
