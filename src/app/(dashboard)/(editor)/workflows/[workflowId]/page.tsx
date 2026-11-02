import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Editor,
  EditorError,
  EditorLoading,
} from "@/feature/editor/components/editor";
import { EditorHeader } from "@/feature/editor/components/editor-header";
import { prefetchWorkflow } from "@/feature/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-guard";
import { HydrateClient } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await requireAuth();

  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
