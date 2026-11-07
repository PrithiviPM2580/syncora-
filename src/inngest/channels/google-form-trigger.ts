import { realtime, staticSchema } from "inngest";

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger-execution";
export type GoogleFormTriggerStatus = "loading" | "success" | "error";

export const googleFormTriggerChannel = realtime.channel({
  name: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: GoogleFormTriggerStatus;
      }>(),
    },
  },
});
