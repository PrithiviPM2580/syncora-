import type { NodeExecutor } from "@/feature/execution/types";
import {
  type ManualTriggerStatus,
  manualTriggerChannel,
} from "@/inngest/channels/manual-trigger";

export type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  const publishStatus = async (status: ManualTriggerStatus) =>
    publish(`manual-trigger-${nodeId}-${status}`, manualTriggerChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");
  const result = await step.run("manual-trigger", async () => context);

  await publishStatus("success");

  return result;
};
