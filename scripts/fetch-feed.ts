import { GoogleGenAI } from "@google/genai";
import { XMLParser } from "fast-xml-parser";
import { writeFile, mkdir } from "fs/promises";
import { sources } from "../src/app/feed/sources.ts";
import type { Entry, Source } from "../src/app/feed/sources.ts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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

const SUMMARIZE_PROMPT = [
  "テック系ニュースフィードの要約者として、英語テキストを日本語1文で要約してください。",
  "専門分野の詳細は思い切って捨て、エンジニアが流し読みして「ふーん」とわかるレベルにする。",
  "",
  "例:",
  "入力: We are bringing deep research to ChatGPT Plus, Team, and Enterprise users, expanding access to our AI agent that synthesizes large amounts of online information into a single report.",
  "出力: ChatGPT Plus等のユーザー向けに、大量のオンライン情報を1つのレポートにまとめるAIエージェント機能を提供開始。",
  "",
  "入力: A new preprint extends single-minus amplitudes to gravitons, with GPT-5.2 Pro helping derive and verify nonzero graviton tree amplitudes in quantum gravity.",
  "出力: GPT-5.2 Proを活用して、量子重力理論の新しい計算手法を拡張・検証した研究論文。",
  "",
  "要約のみ出力。",
].join("\n");

const summarizeJa = async (text: string): Promise<string> => {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: { thinkingConfig: { thinkingBudget: 0 } },
    contents: `${SUMMARIZE_PROMPT}\n\n入力: ${text}\n出力:`,
  });
  return res.text?.trim() ?? "";
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

type HNItem = {
  title: string;
  url?: string;
  id: number;
  score: number;
};

const fetchHNDigest = async (source: Source): Promise<Entry> => {
  const res = await fetch(source.url);
  const ids: number[] = await res.json();
  const top10 = ids.slice(0, 10);

  const items: HNItem[] = await Promise.all(
    top10.map(async (id) => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return r.json() as Promise<HNItem>;
    }),
  );

  const lines = items.map((item) => {
    const url = item.url ?? `https://news.ycombinator.com/item?id=${item.id}`;
    return `- [${item.score}pt] ${item.title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: "Best Stories",
    url: "https://news.ycombinator.com/best",
    summary: lines.join("\n"),
    ogImage: null,
    publishedAt: formatDate.format(new Date()),
  };
};

const decodeHtmlEntities = (text: string) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

const fetchRssDigest = async (source: Source, today: string): Promise<Entry | null> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rawEntries = parsed.rss?.channel?.item ?? [];
  const items = (Array.isArray(rawEntries) ? rawEntries : [rawEntries]) as Record<string, unknown>[];

  const categories = rssDigestCategories.get(source.name);

  const todayItems = items.filter((item) => {
    if (formatDate.format(new Date(String(item.pubDate))) !== today) return false;
    if (!categories) return true;
    const raw = item.category;
    const cats: string[] = Array.isArray(raw) ? raw : raw ? [raw as string] : [];
    return cats.some((c) => categories.has(c));
  });
  if (todayItems.length === 0) return null;

  const lines = todayItems.map((item) => {
    const title = decodeHtmlEntities(item.title as string);
    const url = item.link as string;
    return `- ${title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: `${todayItems.length} Articles`,
    url: source.url.replace("/feed/", "/"),
    summary: lines.join("\n"),
    ogImage: null,
    publishedAt: today,
  };
};

const redditNames = new Set(["r/MacApps", "r/indiehackers", "r/ClaudeAI"]);
const rssDigestNames = new Set(["TechCrunch"]);
const rssDigestCategories = new Map([["TechCrunch", new Set(["AI", "Startups"])]]);
const jinaNames = new Set(["OpenAI"]);

const fetchSource = async (source: Source, today: string): Promise<Entry[]> => {
  if (source.name === "Hacker News") {
    return [await fetchHNDigest(source)];
  }
  if (redditNames.has(source.name)) {
    return [await fetchRedditDigest(source)];
  }
  if (rssDigestNames.has(source.name)) {
    const entry = await fetchRssDigest(source, today);
    return entry ? [entry] : [];
  }
  return fetchRss(source, today);
};

const main = async () => {
  const today = formatDate.format(new Date());

  const results = await Promise.all(sources.map((s) => fetchSource(s, today)));
  const entries = results.flat();

  const jinaEntries = entries.filter((e) => jinaNames.has(e.sourceName));
  await enrichWithJina(jinaEntries);

  const summarizeTargets = entries.filter((e) => jinaNames.has(e.sourceName) && e.summary);
  if (summarizeTargets.length > 0) {
    console.log(`Summarizing ${summarizeTargets.length} entries with Gemini...`);
    for (const entry of summarizeTargets) {
      entry.summary = await summarizeJa(entry.summary);
      console.log(`  Summarized: ${entry.title.slice(0, 40)}`);
    }
  }

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
