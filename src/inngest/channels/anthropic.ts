import { realtime, staticSchema } from "inngest";

export const ANTHROPIC_CHANNEL_NAME = "anthropic-execution";
export type AnthropicStatus = "loading" | "success" | "error";

export const anthropicChannel = realtime.channel({
  name: ANTHROPIC_CHANNEL_NAME,
  topics: {
    status: {
      schema: staticSchema<{
        nodeId: string;
        status: AnthropicStatus;
      }>(),
    },
  },
});
