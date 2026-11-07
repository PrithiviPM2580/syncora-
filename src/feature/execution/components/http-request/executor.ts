import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { Options as KyOptions } from "ky";
import ky from "ky";
import {
  type HttpRequestStatus,
  httpRequestChannel,
} from "@/inngest/channels/http-request";
import { publishRealtime } from "@/lib/realtime";
import type { NodeExecutor } from "../../types";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: HttpRequestStatus) =>
    publish(`http-request-${nodeId}-${status}`, httpRequestChannel.status, {
      nodeId,
      status,
    });

  await publishStatus("loading");

  if (!data.endpoint) {
    await publishStatus("error");
    throw new NonRetriableError("HTTP Request node: No endpoint is configured");
  }

  if (!data.variableName) {
    await publishStatus("error");
    throw new NonRetriableError(
      "HTTP Request node: No variable name is configured",
    );
  }

  if (!data.method) {
    await publishStatus("error");
    throw new NonRetriableError("HTTP Request node: No method is configured");
  }

  try {
    const result = await step.run("http-request", async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method) && data.body) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    await publishStatus("success");
    return result;
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
