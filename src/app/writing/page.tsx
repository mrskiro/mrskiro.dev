import type { Metadata } from "next";

import { readdir } from "fs/promises";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing",
};

const getPosts = async () => {
  const files = await readdir("contents/writing");
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const { frontmatter } = await import(`contents/writing/${slug}.mdx`);
        return { slug, frontmatter: frontmatter as { title: string; date: string } };
      }),
  );
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="grid gap-12">
      <div className="grid gap-4">
        <Link href="/">← Home</Link>
        <h1 className="font-medium">Writing</h1>
      </div>
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
  );
}
