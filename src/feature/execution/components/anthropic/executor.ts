import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import {
  type AnthropicStatus,
  anthropicChannel,
} from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import type { NodeExecutor } from "../../types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export type AnthropicData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: AnthropicStatus) =>
    publish(`anthropic-${nodeId}-${status}`, anthropicChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");

  if (!data.variableName) {
    await publishStatus("error");
    throw new NonRetriableError("Anthropic Node: Variable name is required.");
  }

  if (!data.credentialId) {
    await publishStatus("error");
    throw new NonRetriableError("Anthropic Node: Credential ID is required.");
  }

  if (!data.userPrompt) {
    await publishStatus("error");
    throw new NonRetriableError("Anthropic Node: User prompt is required.");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
      },
    });
  });

  if (!credential) {
    await publishStatus("error");
    throw new NonRetriableError("Anthropic Node: Credential not found.");
  }

  const anthropic = createAnthropic({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-5-sonnet"),
        system: systemPrompt,
        prompt: userPrompt,
      },
    );

    const text =
      steps[0].content[0]?.type === "text" ? steps[0].content[0].text : "";

    await publishStatus("success");

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
