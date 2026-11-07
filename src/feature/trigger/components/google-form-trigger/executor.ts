import type { NodeExecutor } from "@/feature/execution/types";
import {
  type GoogleFormTriggerStatus,
  googleFormTriggerChannel,
} from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ context, nodeId, step, publish }) => {
  const publishStatus = async (status: GoogleFormTriggerStatus) =>
    publish(
      `google-form-trigger-${nodeId}-${status}`,
      googleFormTriggerChannel.status,
      {
        nodeId,
        status,
      },
    );

  await publishStatus("loading");

  const result = await step.run("google-form-trigger", async () => context);

  await publishStatus("success");

  return result;
};
