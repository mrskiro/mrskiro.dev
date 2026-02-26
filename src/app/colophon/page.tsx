import type { Metadata } from "next";

import Link from "next/link";

const getContent = async () => {
  const { default: Content, frontmatter } = await import("contents/colophon.mdx");
  return { Content, frontmatter: frontmatter as { title: string } };
};

export const generateMetadata = async (): Promise<Metadata> => {
  const { frontmatter } = await getContent();
  return { title: frontmatter.title };
};

export default async function Page() {
  const { Content, frontmatter } = await getContent();

  return (
    <div>
      <Link href="/">← Home</Link>
      <h1 className="mt-4 font-semibold">{frontmatter.title}</h1>
      <div className="mt-8">
        <Content />
      </div>
    </div>
  );
}
