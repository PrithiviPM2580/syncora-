"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  const { data: posts } = useQuery(trpc.getPosts.queryOptions());

  return (
    <div>
      <p>{JSON.stringify(posts, null, 2)}</p>
    </div>
  );
}
