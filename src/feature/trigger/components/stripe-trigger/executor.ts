import type { NodeExecutor } from "@/feature/execution/types";
import {
  type StripeTriggerStatus,
  stripeTriggerChannel,
} from "@/inngest/channels/stripe-trigger";

export type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  const publishStatus = async (status: StripeTriggerStatus) =>
    publish(`stripe-trigger-${nodeId}-${status}`, stripeTriggerChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");

  const result = await step.run("stripe-trigger", async () => context);

  await publishStatus("success");

  return result;
};
