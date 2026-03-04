import { XMLParser } from "fast-xml-parser";
import { writeFile, mkdir } from "fs/promises";
import { sources } from "../src/app/feed/sources.ts";
import type { Entry, Source } from "../src/app/feed/sources.ts";

const FEED_DIR = "contents/feed";

const formatDate = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tokyo",
});

const parser = new XMLParser({ ignoreAttributes: false });

const extractImage = (item: Record<string, unknown>): string | undefined => {
  const media = item["media:content"] as Record<string, unknown> | undefined;
  if (media?.["@_url"]) return media["@_url"] as string;
  return undefined;
};

const extractContent = (item: Record<string, unknown>): string | undefined => {
  const field = item.content ?? item["content:encoded"] ?? item.description;
  if (!field) return undefined;
  const raw = typeof field === "object" && field !== null
    ? String((field as Record<string, unknown>)["#text"] ?? "")
    : String(field);
  if (!raw) return undefined;
  const text = raw.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text || undefined;
};

const parseAtomLink = (link: unknown): string => {
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const alt = link.find((l: Record<string, unknown>) => l["@_rel"] === "alternate");
    return (alt ?? link[0])["@_href"] as string;
  }
  return (link as Record<string, unknown>)["@_href"] as string;
};

type JinaResponse = {
  data?: {
    content?: string;
    metadata?: Record<string, string>;
  };
};

const fetchJina = async (url: string): Promise<{ content?: string; ogImage?: string }> => {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "application/json", "X-Retain-Images": "none" },
      signal: AbortSignal.timeout(30_000),
    });
    const json: JinaResponse = await res.json();
    return {
      ...(json.data?.content && { content: json.data.content }),
      ...(json.data?.metadata?.["og:image"] && { ogImage: json.data.metadata["og:image"] }),
    };
  } catch {
    return {};
  }
};

const fetchRss = async (source: Source, today: string): Promise<Entry[]> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rawEntries = parsed.feed
    ? (parsed.feed.entry ?? [])
    : (parsed.rss?.channel?.item ?? []);
  const items = Array.isArray(rawEntries) ? rawEntries : [rawEntries];

  return items
    .map((item: Record<string, unknown>) => {
      const isAtom = !!parsed.feed;
      return {
        title: item.title as string,
        url: isAtom ? parseAtomLink(item.link) : (item.link as string),
        publishedAt: formatDate.format(new Date(String(isAtom ? (item.updated ?? item.published) : item.pubDate))),
        image: extractImage(item),
        content: extractContent(item),
      };
    })
    .filter((item) => item.publishedAt === today)
    .map((item) => ({
      sourceName: source.name,
      title: item.title,
      url: item.url,
      summary: item.content ?? "",
      publishedAt: item.publishedAt,
      ogImage: item.image ?? null,
    }));
};

const fetchRedditDigest = async (source: Source): Promise<Entry> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const entries = parsed.feed?.entry ?? [];
  const items = (Array.isArray(entries) ? entries : [entries]) as Record<string, unknown>[];

  const lines = items.map((item) => {
    const title = item.title as string;
    const url = parseAtomLink(item.link);
    return `- ${title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: "Hot Topics",
    url: source.url.replace("/.rss", "/"),
    summary: lines.join("\n"),
    ogImage: null,
    publishedAt: formatDate.format(new Date()),
  };
};

const enrichWithJina = async (entries: Entry[]) => {
  const targets = entries.filter((e) => !e.summary || e.ogImage === null);
  if (targets.length === 0) return;

  console.log(`Enriching ${targets.length} entries with Jina Reader...`);
  for (const entry of targets) {
    const jina = await fetchJina(entry.url);
    if (entry.ogImage === null && jina.ogImage) entry.ogImage = jina.ogImage;
    if (!entry.summary && jina.content) entry.summary = jina.content;
    console.log(`  Enriched: ${entry.title.slice(0, 40)}`);
  }
};

const redditNames = new Set(["r/MacApps", "r/indiehackers", "r/ClaudeAI"]);
const jinaNames = new Set(["OpenAI"]);

const fetchSource = async (source: Source, today: string): Promise<Entry[]> => {
  if (redditNames.has(source.name)) {
    return [await fetchRedditDigest(source)];
  }
  return fetchRss(source, today);
};

const main = async () => {
  const today = formatDate.format(new Date());

  const results = await Promise.all(sources.map((s) => fetchSource(s, today)));
  const entries = results.flat();

  const jinaEntries = entries.filter((e) => jinaNames.has(e.sourceName));
  await enrichWithJina(jinaEntries);

  const batch = {
    fetchedAt: new Date().toISOString(),
    entries,
  };

  await mkdir(FEED_DIR, { recursive: true });
  await writeFile(`${FEED_DIR}/${today}.json`, JSON.stringify(batch, null, 2) + "\n");
  console.log(`Saved ${entries.length} entries to ${today}.json`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
