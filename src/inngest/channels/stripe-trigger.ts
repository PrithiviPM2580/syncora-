import { realtime, staticSchema } from "inngest";

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-execution";
export type StripeTriggerStatus = "loading" | "success" | "error";

export const stripeTriggerChannel = realtime.channel({
  name: STRIPE_TRIGGER_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: StripeTriggerStatus;
      }>(),
    },
  },
});
