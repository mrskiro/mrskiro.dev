import type { ComponentType } from "react";

export type Frontmatter = {
  title: string;
  date: string;
  description?: string;
};

type PostModule = {
  default: ComponentType;
  frontmatter: Frontmatter;
};

// Turbopack's glob does not match upward-relative patterns ("../../contents/**"),
// so the directory is passed via `base`. Keys still come back as "../../contents/writing/<slug>.mdx".
const modules = import.meta.glob("*.mdx", { base: "../../contents/writing" }) as Record<
  string,
  () => Promise<PostModule>
>;

const toSlug = (path: string) => path.slice(path.lastIndexOf("/") + 1).replace(/\.mdx$/, "");

export const getSlugs = () => Object.keys(modules).map(toSlug);

export const getPost = (slug: string) => {
  const load = modules[`../../contents/writing/${slug}.mdx`];
  if (!load) throw new Error(`No such post: ${slug}`);
  return load();
};

export const getPosts = async () => {
  const posts = await Promise.all(
    Object.entries(modules).map(async ([path, load]) => ({
      slug: toSlug(path),
      frontmatter: (await load()).frontmatter,
    })),
  );
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
};
