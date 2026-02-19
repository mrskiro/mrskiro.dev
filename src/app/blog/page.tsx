import { readdir } from "fs/promises";
import Link from "next/link";

type PostMeta = {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
  };
};

const getPosts = async (): Promise<PostMeta[]> => {
  const files = await readdir("contents/blog");
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const { frontmatter } = await import(`contents/blog/${slug}.mdx`);
        return { slug, frontmatter };
      }),
  );
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
};

export default async function Page() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(({ slug, frontmatter }) => (
        <li key={slug}>
          <Link href={`/blog/${slug}`}>{frontmatter.title}</Link>
          <time dateTime={frontmatter.date}>{frontmatter.date}</time>
        </li>
      ))}
    </ul>
  );
}
