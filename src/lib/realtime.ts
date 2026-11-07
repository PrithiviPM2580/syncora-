import type { StepTools } from "@/feature/execution/types";

export function publishRealtime(step: StepTools) {
  return step.realtime.publish.bind(step.realtime);
}
