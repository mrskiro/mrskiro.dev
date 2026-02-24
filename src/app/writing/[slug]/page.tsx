import type { Metadata } from "next";

import { readdir } from "fs/promises";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { frontmatter } = await import(`contents/writing/${slug}.mdx`);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
};

export const generateStaticParams = async () => {
  const files = await readdir("contents/writing");
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
};

export const dynamicParams = false;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { default: Post, frontmatter } = await import(`contents/writing/${slug}.mdx`);

  return (
    <div>
      <div className="grid gap-8">
        <Link href="/writing">← Writing</Link>
        <div className="grid gap-1">
          <h1 className="font-semibold">{frontmatter.title}</h1>
          <time dateTime={frontmatter.date} className="font-mono">
            {frontmatter.date}
          </time>
        </div>
      </div>
      <div className="mt-8">
        <Post />
      </div>
    </div>
  );
}
