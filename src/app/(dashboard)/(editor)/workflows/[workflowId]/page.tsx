import { requireAuth } from "@/lib/auth-guard";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await requireAuth();

  const { workflowId } = await params;
  return <div>Page: {workflowId}</div>;
}
