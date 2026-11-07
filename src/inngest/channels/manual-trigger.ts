import { realtime, staticSchema } from "inngest";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";
export type ManualTriggerStatus = "loading" | "success" | "error";

export const manualTriggerChannel = realtime.channel({
  name: MANUAL_TRIGGER_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: ManualTriggerStatus;
      }>(),
    },
  },
});
