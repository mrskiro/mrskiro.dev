import { readdir } from "fs/promises";

export const dynamic = "force-static";

const BASE_URL = "https://mrskiro.dev";

const getPosts = async () => {
  const files = await readdir("contents/writing");
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const { frontmatter } = await import(`contents/writing/${slug}.mdx`);
        return {
          slug,
          frontmatter: frontmatter as { title: string; date: string; description?: string },
        };
      }),
  );
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
};

export const GET = async () => {
  const posts = await getPosts();

  const items = posts
    .map(
      ({ slug, frontmatter }) => `    <item>
      <title>${escapeXml(frontmatter.title)}</title>
      <link>${BASE_URL}/writing/${slug}</link>
      <guid>${BASE_URL}/writing/${slug}</guid>
      <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>${frontmatter.description ? `\n      <description>${escapeXml(frontmatter.description)}</description>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>mrskiro</title>
    <link>${BASE_URL}</link>
    <description>Software Engineer from Japan. Indie hacker building things around UI/UX and AI.</description>
    <language>ja</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
