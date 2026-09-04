import type { Metadata } from "next";

import Link from "next/link";

import { getPosts } from "@/utils/posts";

export const metadata: Metadata = {
  title: "Writing",
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <div>
      <Link href="/">← Home</Link>
      <div className="mt-4 grid gap-4">
        <h1 className="font-semibold">Writing</h1>
        <ul className="grid gap-2">
          {posts.map(({ slug, frontmatter }) => (
            <li key={slug} className="flex gap-4">
              <time dateTime={frontmatter.date} className="shrink-0 font-mono">
                {frontmatter.date}
              </time>
              <Link href={`/writing/${slug}`}>{frontmatter.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
