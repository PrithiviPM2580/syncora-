import { NonRetriableError } from "inngest";
import type { Options as KyOptions } from "ky";
import ky from "ky";
import type { NodeExecutor } from "../../types";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint is configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError(
      "HTTP Request node: No variable name is configured",
    );
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint as string;
    const method = data.method || "GET";
    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method) && data.body) {
      options.body = data.body;
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

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload.httpResponse,
      };
    }
    return {
      ...context,
      ...responsePayload,
    };
  });

  return result;
};
