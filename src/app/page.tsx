import prisma from "@/lib/db";

export default async function Home() {
  const posts = await prisma.post.findMany();
  return (
    <div>
      <p>{JSON.stringify(posts, null, 2)}</p>
    </div>
  );
}
