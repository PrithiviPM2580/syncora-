import { realtime, staticSchema } from "inngest";

export const GEMINI_CHANNEL_NAME = "gemini-execution";
export type GeminiStatus = "loading" | "success" | "error";

export const geminiChannel = realtime.channel({
  name: GEMINI_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: GeminiStatus;
      }>(),
    },
  },
});
