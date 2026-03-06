import { GoogleGenAI, Type } from "@google/genai";
import { XMLParser } from "fast-xml-parser";
import { writeFile, mkdir } from "fs/promises";

import type { Entry, Source } from "../src/app/feed/sources.ts";

import { sources } from "../src/app/feed/sources.ts";

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
  const raw =
    typeof field === "object" && field !== null
      ? String((field as Record<string, unknown>)["#text"] ?? "")
      : String(field);
  if (!raw) return undefined;
  const text = raw
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

const fetchRss = async (source: Source, since: Date): Promise<Entry[]> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rawEntries = parsed.feed ? (parsed.feed.entry ?? []) : (parsed.rss?.channel?.item ?? []);
  const items = Array.isArray(rawEntries) ? rawEntries : [rawEntries];

  return items
    .map((item: Record<string, unknown>) => {
      const isAtom = !!parsed.feed;
      const date = new Date(String(isAtom ? (item.updated ?? item.published) : item.pubDate));
      return {
        title: item.title as string,
        url: isAtom ? parseAtomLink(item.link) : (item.link as string),
        publishedAt: formatDate.format(date),
        date,
        image: extractImage(item),
        content: extractContent(item),
      };
    })
    .filter((item) => item.date >= since)
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

  const top10 = items.slice(0, 10);
  const rawTitles = top10.map((item) => item.title as string);
  const jaTitles = await translateTitles(rawTitles);

  const lines = top10.map((item, i) => {
    const title = jaTitles[i] ?? (item.title as string);
    const url = parseAtomLink(item.link);
    return `- ${title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: "Hot Topics",
    url: source.url.replace("/.rss", "/"),
    summary: lines.join("\n"),
    ogImage: digestOgImages[source.name] ?? null,
    publishedAt: formatDate.format(new Date()),
  };
};

const SUMMARIZE_PROMPT = [
  "テック系ニュースフィードの要約者として、テキストを日本語1文で要約してください。",
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

const TRANSLATE_TITLES_PROMPT = [
  "テック系ニュースのタイトルを日本語に翻訳してください。",
  "ルール：",
  "- 直訳ではなく、日本語のニュース見出しとして自然な表現にする",
  "- 固有名詞（人名・企業名・製品名）は英語のまま残す",
  "- 各行1タイトル、番号付きで出力",
  "- 翻訳のみ出力",
].join("\n");

const translateTitles = async (titles: string[]): Promise<string[]> => {
  const numbered = titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: { thinkingConfig: { thinkingBudget: 0 } },
    contents: `${TRANSLATE_TITLES_PROMPT}\n\n${numbered}`,
  });
  const lines = (res.text ?? "").trim().split("\n");
  return lines.map((line) => line.replace(/^\d+\.\s*/, ""));
};

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
  kids?: number[];
};

type HNComment = {
  text?: string;
};

const HN_PROMPT = [
  "Hacker Newsのストーリーについて、各ストーリーごとに：",
  "1. タイトルを日本語に翻訳（直訳ではなく、日本語のニュース見出しとして自然な表現にする。固有名詞は英語のまま）",
  "2. コメントの雰囲気を30文字以内で要約（例：「メモリ8GBの制限に不満の声が多い」「セキュリティ面で高評価、乗り換え報告も」）。コメントがない場合はnull",
].join("\n");

const fetchHNComments = async (kids: number[], limit = 5): Promise<string[]> => {
  const topKids = kids.slice(0, limit);
  const comments = await Promise.all(
    topKids.map(async (id) => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const c: HNComment = await r.json();
      return (
        c.text
          ?.replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim() ?? ""
      );
    }),
  );
  return comments.filter(Boolean);
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

  const storiesWithComments = await Promise.all(
    items.map(async (item) => {
      const comments = item.kids ? await fetchHNComments(item.kids) : [];
      return { ...item, comments };
    }),
  );

  const input = storiesWithComments
    .map((item, i) => {
      const commentsBlock =
        item.comments.length > 0
          ? `コメント:\n${item.comments.map((c) => c.slice(0, 200)).join("\n")}`
          : "コメント: なし";
      return `ストーリー${i + 1}: ${item.title}\n${commentsBlock}`;
    })
    .join("\n\n");

  const geminiRes = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            commentSummary: { type: Type.STRING, nullable: true },
          },
          required: ["title", "commentSummary"],
        },
      },
    },
    contents: `${HN_PROMPT}\n\n${input}`,
  });

  let parsed: { title: string; commentSummary: string | null }[];
  try {
    parsed = JSON.parse(geminiRes.text ?? "[]");
  } catch {
    console.warn("HN structured output parse failed, falling back to translate-only");
    const jaTitles = await translateTitles(items.map((item) => item.title));
    parsed = jaTitles.map((t) => ({ title: t, commentSummary: null }));
  }

  const lines = items.map((item, i) => {
    const url = `https://news.ycombinator.com/item?id=${item.id}`;
    const title = parsed[i]?.title ?? item.title;
    const comment = parsed[i]?.commentSummary;
    const titleLine = comment
      ? `- [${item.score}pt] ${title} | ${comment}`
      : `- [${item.score}pt] ${title}`;
    return `${titleLine}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: "Best Stories",
    url: "https://news.ycombinator.com/best",
    summary: lines.join("\n"),
    ogImage: digestOgImages[source.name] ?? null,
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

const fetchRssDigest = async (source: Source, since: Date): Promise<Entry | null> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rawEntries = parsed.rss?.channel?.item ?? [];
  const items = (Array.isArray(rawEntries) ? rawEntries : [rawEntries]) as Record<
    string,
    unknown
  >[];

  const categories = rssDigestCategories.get(source.name);

  const recentItems = items.filter((item) => {
    if (new Date(String(item.pubDate)) < since) return false;
    if (!categories) return true;
    const raw = item.category;
    const cats: string[] = Array.isArray(raw) ? raw : raw ? [raw as string] : [];
    return cats.some((c) => categories.has(c));
  });
  if (recentItems.length === 0) return null;

  const rawTitles = recentItems.map((item) => decodeHtmlEntities(item.title as string));
  const jaTitles = await translateTitles(rawTitles);

  const lines = recentItems.map((item, i) => {
    const title = jaTitles[i] ?? decodeHtmlEntities(item.title as string);
    const url = item.link as string;
    return `- ${title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: `${recentItems.length} Articles`,
    url: source.url.replace("/feed/", "/"),
    summary: lines.join("\n"),
    ogImage: digestOgImages[source.name] ?? null,
    publishedAt: formatDate.format(new Date()),
  };
};

const RELEASE_TRANSLATE_PROMPT = [
  "GitHubリリースノートを日本語に翻訳し、各項目にカテゴリタグを付けてください。",
  "ルール：",
  "- 技術用語・固有名詞・コマンド名・設定名はそのまま残す",
  "- 簡潔に、機能の要点だけ伝える",
  "- tagは Added / Fixed / Improved / Changed のいずれか",
].join("\n");

const fetchGitHubReleaseDigest = async (source: Source, since: Date): Promise<Entry[]> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const rawEntries = parsed.feed?.entry ?? [];
  const entries = (Array.isArray(rawEntries) ? rawEntries : [rawEntries]) as Record<
    string,
    unknown
  >[];

  const recentEntries = entries.filter(
    (entry) => new Date(String(entry.updated ?? entry.published)) >= since,
  );

  if (recentEntries.length === 0) return [];

  const results: Entry[] = [];
  for (const entry of recentEntries) {
    const content = String(
      (entry.content as Record<string, unknown>)?.["#text"] ?? entry.content ?? "",
    );
    const liItems = [...content.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) =>
      m[1]!.replace(/<[^>]+>/g, "").trim(),
    );
    if (liItems.length === 0) continue;

    const numbered = liItems.map((item, i) => `${i + 1}. ${item}`).join("\n");
    const geminiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tag: { type: Type.STRING },
              text: { type: Type.STRING },
            },
            required: ["tag", "text"],
          },
        },
      },
      contents: `${RELEASE_TRANSLATE_PROMPT}\n\n${numbered}`,
    });

    let parsed: { tag: string; text: string }[];
    try {
      parsed = JSON.parse(geminiRes.text ?? "[]");
    } catch {
      console.warn(`${source.name} translation parse failed, using original`);
      parsed = liItems.map((item) => ({ tag: "Other", text: item }));
    }

    const lines = parsed.map((item) => `- [${item.tag}] ${item.text}`);

    results.push({
      sourceName: source.name,
      title: entry.title as string,
      url: parseAtomLink(entry.link),
      summary: lines.join("\n"),
      ogImage:
        ((entry["media:thumbnail"] as Record<string, unknown>)?.["@_url"] as string)?.replace(
          /s=\d+/,
          "s=200",
        ) ?? null,
      publishedAt: formatDate.format(new Date(String(entry.updated ?? entry.published))),
    });
  }

  return results;
};

const extractPHTagline = (content: unknown): string => {
  const raw =
    typeof content === "object" && content !== null
      ? String((content as Record<string, unknown>)["#text"] ?? "")
      : String(content ?? "");
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split("Discussion")[0]!
    .trim();
};

const fetchProductHuntDigest = async (source: Source): Promise<Entry> => {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "feed-reader/1.0" },
  });
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const entries = parsed.feed?.entry ?? [];
  const items = (Array.isArray(entries) ? entries : [entries]) as Record<string, unknown>[];

  const top10 = items.slice(0, 10);
  const titlesWithTagline = top10.map((item) => {
    const tagline = extractPHTagline(item.content);
    return tagline ? `${item.title as string} — ${tagline}` : (item.title as string);
  });
  const jaTitles = await translateTitles(titlesWithTagline);

  const lines = top10.map((item, i) => {
    const title = jaTitles[i] ?? titlesWithTagline[i];
    const url = parseAtomLink(item.link);
    return `- ${title}\n  ${url}`;
  });

  return {
    sourceName: source.name,
    title: "Trending",
    url: "https://www.producthunt.com",
    summary: lines.join("\n"),
    ogImage: digestOgImages[source.name] ?? null,
    publishedAt: formatDate.format(new Date()),
  };
};

const githubReleaseNames = new Set(["Claude Code"]);
const redditNames = new Set(["r/MacApps", "r/indiehackers", "r/ClaudeAI"]);
const rssDigestNames = new Set(["TechCrunch"]);
const rssDigestCategories = new Map([["TechCrunch", new Set(["AI", "Startups"])]]);
const jinaNames = new Set(["OpenAI", "Simon Willison", "Martin Fowler", "laiso", "mtx2s"]);

const digestOgImages: Record<string, string> = {
  "Hacker News": "https://news.ycombinator.com/y18.svg",
  "r/MacApps": "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
  "r/indiehackers": "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
  "r/ClaudeAI": "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
  TechCrunch: "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
  "Product Hunt": "https://ph-static.imgix.net/ph-logo-1.png",
};

const fetchSource = async (source: Source, since: Date): Promise<Entry[]> => {
  if (githubReleaseNames.has(source.name)) {
    return fetchGitHubReleaseDigest(source, since);
  }
  if (source.name === "Hacker News") {
    return [await fetchHNDigest(source)];
  }
  if (redditNames.has(source.name)) {
    return [await fetchRedditDigest(source)];
  }
  if (source.name === "Product Hunt") {
    return [await fetchProductHuntDigest(source)];
  }
  if (rssDigestNames.has(source.name)) {
    const entry = await fetchRssDigest(source, since);
    return entry ? [entry] : [];
  }
  return fetchRss(source, since);
};

const main = async () => {
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const results = await Promise.all(sources.map((s) => fetchSource(s, since)));
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
    fetchedAt: now.toISOString(),
    entries,
  };

  await mkdir(FEED_DIR, { recursive: true });
  const filename = formatDate.format(now);
  await writeFile(`${FEED_DIR}/${filename}.json`, JSON.stringify(batch, null, 2) + "\n");
  console.log(`Saved ${entries.length} entries to ${filename}.json`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
