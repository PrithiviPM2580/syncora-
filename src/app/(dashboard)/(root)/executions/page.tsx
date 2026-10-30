import { requireAuth } from "@/lib/auth-guard";

export default async function Page() {
  await requireAuth();
  return <div>Page</div>;
}
