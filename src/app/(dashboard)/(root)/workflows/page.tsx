import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  WorkflowContainer,
  WorkflowError,
  WorkflowList,
  WorkflowLoading,
} from "@/feature/workflows/components/workflows";
import { workflowParamsLoader } from "@/feature/workflows/server/params-loader";
import { prefetchWorkflows } from "@/feature/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-guard";
import { HydrateClient } from "@/trpc/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
  await requireAuth();

  const params = await workflowParamsLoader(searchParams);
  prefetchWorkflows(params);

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError />}>
          <Suspense fallback={<WorkflowLoading />}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
