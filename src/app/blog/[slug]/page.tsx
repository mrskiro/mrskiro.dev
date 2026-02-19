import { readdir } from "fs/promises";

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const files = await readdir("contents/blog");
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
};

export const dynamicParams = false;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { default: Post } = await import(`contents/blog/${slug}.mdx`);
  return <Post />;
}
