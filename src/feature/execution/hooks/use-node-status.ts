"use client";

import type { Realtime } from "inngest";
import { type ClientSubscriptionToken, useRealtime } from "inngest/react";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface NodeStatusProps {
  nodeId: string;
  channel: Realtime.ChannelInput;
  topics: Readonly<string[]>;
  token: () => Promise<ClientSubscriptionToken>;
}

const isNodeStatusMessage = (
  data: unknown,
): data is { nodeId: string; status: NodeStatus } =>
  typeof data === "object" &&
  data !== null &&
  "nodeId" in data &&
  typeof data.nodeId === "string" &&
  "status" in data &&
  (data.status === "initial" ||
    data.status === "loading" ||
    data.status === "success" ||
    data.status === "error");

export function useNodeStatus({
  nodeId,
  channel,
  topics,
  token,
}: NodeStatusProps) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { messages, connectionStatus } = useRealtime({
    channel: channel,
    topics,
    token,
  });

  useEffect(() => {
    const latestMessage = [...messages.all]
      .reverse()
      .find(
        (message) =>
          message.kind !== "run" &&
          message.topic === "status" &&
          isNodeStatusMessage(message.data) &&
          message.data.nodeId === nodeId,
      );

    if (latestMessage && isNodeStatusMessage(latestMessage.data)) {
      setStatus(latestMessage.data.status);
    }
  }, [messages.all, nodeId]);

  return {
    status,
    connectionStatus,
  };
}
