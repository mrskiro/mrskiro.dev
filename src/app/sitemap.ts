import type { MetadataRoute } from "next";

import { readdir } from "fs/promises";

const BASE_URL = "https://mrskiro.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = await readdir("contents/writing");
  const slugs = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  const writingEntries = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await import(`contents/writing/${slug}.mdx`);
      return {
        url: `${BASE_URL}/writing/${slug}`,
        lastModified: new Date(frontmatter.date),
      };
    }),
  );

  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/writing` },
    { url: `${BASE_URL}/colophon` },
    ...writingEntries,
  ];
}
