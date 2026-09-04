import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/posts";

const BASE_URL = "https://mrskiro.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const writingEntries = posts.map(({ slug, frontmatter }) => ({
    url: `${BASE_URL}/writing/${slug}`,
    lastModified: new Date(frontmatter.date),
  }));

  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/writing` },
    { url: `${BASE_URL}/colophon` },
    { url: `${BASE_URL}/uses` },
    ...writingEntries,
  ];
}
