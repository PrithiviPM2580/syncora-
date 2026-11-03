"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { NodeSelector } from "./node-selector";
import { PlaceholderNode } from "./react-flow/placeholder-node";

export const InitialNode = memo(() => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  return (
    <NodeSelector
      open={selectOpen}
      onOpenChange={setSelectOpen}
      nativeButton={false}
    >
      <PlaceholderNode>
        <div className="cursor-pointer flex items-center justify-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
