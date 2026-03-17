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
  { name: "Hacker News", url: "https://hacker-news.firebaseio.com/v0/beststories.json" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "Simon Willison", url: "https://simonwillison.net/atom/entries/" },
  { name: "Martin Fowler", url: "https://martinfowler.com/feed.atom" },
  { name: "laiso", url: "https://blog.lai.so/rss/" },
  { name: "mtx2s", url: "https://mtx2s.hatenablog.com/rss" },
  // TODO: Product Hunt — GraphQL API (upvote順) を使いたいがダッシュボードにアクセスできずトークン未取得。RSSで代替中
  { name: "Product Hunt", url: "https://www.producthunt.com/feed" },
  { name: "Anthropic", url: "https://www.anthropic.com/news" },
  { name: "Y Combinator", url: "https://www.ycombinator.com/companies" },
  { name: "BRIDGE", url: "https://thebridge.jp/feed" },
  { name: "Latent Space", url: "https://www.latent.space/feed" },
] as const satisfies Source[];
