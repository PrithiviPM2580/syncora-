import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { type OpenAIStatus, openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import type { NodeExecutor } from "../../types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export type OpenaiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenaiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: OpenAIStatus) =>
    publish(`openai-${nodeId}-${status}`, openaiChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");

  if (!data.variableName) {
    await publishStatus("error");
    throw new NonRetriableError("OpenAI Node: Variable name is required.");
  }

  if (!data.credentialId) {
    await publishStatus("error");
    throw new NonRetriableError("OpenAI Node: Credential ID is required.");
  }

  if (!data.userPrompt) {
    await publishStatus("error");
    throw new NonRetriableError("OpenAI Node: User prompt is required.");
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
    throw new NonRetriableError("OpenAI Node: Credential not found.");
  }

  const openai = createOpenAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai("gpt-3.5-turbo"),
      system: systemPrompt,
      prompt: userPrompt,
    });

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
