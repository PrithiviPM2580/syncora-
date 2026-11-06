import type { NodeExecutor } from "@/feature/execution/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
}) => {
  const result = await step.run("manual-trigger", async () => context);

  return result;
};
