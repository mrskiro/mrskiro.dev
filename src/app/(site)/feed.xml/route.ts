import { getPosts } from "@/utils/posts";

export const dynamic = "force-static";

const BASE_URL = "https://mrskiro.dev";

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
