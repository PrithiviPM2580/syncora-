import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { type GeminiStatus, geminiChannel } from "@/inngest/channels/gemini";
import type { NodeExecutor } from "../../types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export type GeminiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: GeminiStatus) =>
    publish(`gemini-${nodeId}-${status}`, geminiChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");

  if (!data.variableName) {
    await publishStatus("error");
    throw new NonRetriableError("Gemini Node: Variable name is required.");
  }

  if (!data.userPrompt) {
    await publishStatus("error");
    throw new NonRetriableError("Gemini Node: User prompt is required.");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.5-flash"),
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
