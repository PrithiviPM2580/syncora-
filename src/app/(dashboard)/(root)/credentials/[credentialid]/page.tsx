import { requireAuth } from "@/lib/auth-guard";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await requireAuth();
  const { credentialId } = await params;
  return <div>Page: {credentialId}</div>;
}
