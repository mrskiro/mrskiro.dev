export type Source = {
  name: string;
  url: string;
};

export type Entry = {
  sourceName: string;
  title: string;
  url: string;
  summary: string;
  ogImage: string | null;
  publishedAt: string;
};

export const sources = [
  { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
  { name: "Claude Code", url: "https://github.com/anthropics/claude-code/releases.atom" },
  { name: "r/MacApps", url: "https://www.reddit.com/r/MacApps/hot/.rss" },
  { name: "r/indiehackers", url: "https://www.reddit.com/r/indiehackers/hot/.rss" },
  { name: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI/hot/.rss" },
  // TODO: Anthropic — 公式RSSなし。https://www.anthropic.com/news をスクレイピングして取得する
] as const satisfies Source[];
