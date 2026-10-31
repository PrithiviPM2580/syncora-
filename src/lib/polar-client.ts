import { createPolarCore } from "@polar-sh/sdk/2026-10";

const accessToken = process.env.POLAR_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("POLAR_ACCESS_TOKEN environment variable is not set.");
}

export const polarClient = createPolarCore({
  accessToken,
  environment: "sandbox",
});
