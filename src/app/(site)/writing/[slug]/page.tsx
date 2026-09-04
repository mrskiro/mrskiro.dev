import type { Metadata } from "next";

import Link from "next/link";
import { Suspense } from "react";

import { getPost, getSlugs } from "@/utils/posts";

import { Tategaki } from "./tategaki";
import { WritingModeSwitch } from "./writing-mode-switch";

type Props = PageProps<"/writing/[slug]">;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { frontmatter } = await getPost(slug);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
};

export const generateStaticParams = () => getSlugs().map((slug) => ({ slug }));

export const dynamicParams = false;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { default: Post, frontmatter } = await getPost(slug);

  return (
    <div>
      <div className="flex justify-between">
        <Link href="/writing">← Writing</Link>
        <Suspense>
          <WritingModeSwitch />
        </Suspense>
      </div>
      <Suspense>
        <Tategaki>
          <div className="mt-4 grid gap-1">
            <h1 className="font-semibold">{frontmatter.title}</h1>
            <time dateTime={frontmatter.date} className="font-mono">
              {frontmatter.date}
            </time>
          </div>
          <div className="mt-8">
            <Post />
          </div>
        </Tategaki>
      </Suspense>
    </div>
  );
}
