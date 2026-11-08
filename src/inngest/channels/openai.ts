import { realtime, staticSchema } from "inngest";

export const OPENAI_CHANNEL_NAME = "openai-execution";
export type OpenAIStatus = "loading" | "success" | "error";

export const openaiChannel = realtime.channel({
  name: OPENAI_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: OpenAIStatus;
      }>(),
    },
  },
});
