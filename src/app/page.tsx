import { requireAuth } from "@/lib/auth-guard";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();

  const user = await caller.getUser();

  return (
    <div>
      <p>{JSON.stringify(user, null, 2)}</p>
    </div>
  );
}
