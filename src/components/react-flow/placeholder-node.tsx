"use client";

import { Handle, Position } from "@xyflow/react";
import type { ComponentProps } from "react";

import { BaseNode } from "@/components/react-flow/base-node";

export type PlaceholderNodeProps = ComponentProps<"div"> & {
  children?: React.ReactNode;
};

export function PlaceholderNode({ children, ...props }: PlaceholderNodeProps) {
  return (
    <BaseNode
      className="w-auto h-auto border-dashed border-gray-400 bg-card p-4 text-center text-gray-400 shadow-none cursor-pointer hover:border-gray-500 hover:bg-gray-50"
      {...props}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}

PlaceholderNode.displayName = "PlaceholderNode";
