"use client";

import { useRealtime } from "inngest/react";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "../components/http-request/actions";

interface NodeStatusProps {
  nodeId: string;
}

export function useNodeStatus({ nodeId }: NodeStatusProps) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { messages, connectionStatus } = useRealtime({
    channel: httpRequestChannel,
    topics: ["status"] as const,
    token: fetchHttpRequestRealtimeToken,
  });

  useEffect(() => {
    const message = messages.byTopic.status?.data;

    if (message?.nodeId === nodeId) {
      setStatus(message.status);
    }
  }, [messages.byTopic.status, nodeId]);

  return {
    status,
    connectionStatus,
  };
}
