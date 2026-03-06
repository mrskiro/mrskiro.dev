import { readdir, readFile } from "fs/promises";
import Link from "next/link";

import type { Entry } from "./sources.ts";

import { sources } from "./sources.ts";

const loadBatches = async (): Promise<{ fetchedAt: string; entries: Entry[] }[]> => {
  try {
    const files = await readdir("contents/feed");
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    return await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await readFile(`contents/feed/${file}`, "utf-8");
        return JSON.parse(content) as { fetchedAt: string; entries: Entry[] };
      }),
    );
  } catch {
    return [];
  }
};

const formatDateTime = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo",
});

const digestSources = new Set([
  "r/MacApps",
  "r/indiehackers",
  "r/ClaudeAI",
  "Hacker News",
  "TechCrunch",
  "Claude Code",
  "Product Hunt",
]);

const parseSummaryLines = (summary: string) => {
  const lines = summary.split("\n");
  const items: { title: string; url: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.startsWith("- ")) {
      const title = line.slice(2);
      const url = lines[i + 1]?.trim() ?? "";
      items.push({ title, url });
      i++;
    }
  }
  return items;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const batches = await loadBatches();

  return (
    <>
      <aside className="grid content-start gap-6 border-r border-neutral-100 px-6 py-12">
        <Link href="/" className="no-underline">
          ← Home
        </Link>
        <div className="grid gap-3">
          <span className="text-xs font-medium text-neutral-500">Sources</span>
          <ul className="grid gap-3">
            {["All", ...sources.map((s) => s.name)].map((name) => (
              <li key={name}>
                <Link
                  href={name === "All" ? "/feed" : `/feed?source=${name}`}
                  className={`text-sm no-underline ${
                    (name === "All" && !source) || name === source
                      ? "font-medium"
                      : "text-neutral-400"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="overflow-y-auto p-12">
        {batches.length === 0 ? (
          <p className="text-neutral-400">No feed data yet.</p>
        ) : (
          <div className="grid gap-8">
            {batches.map((batch) => {
              const entries = source
                ? batch.entries.filter((e) => e.sourceName === source)
                : batch.entries;
              if (entries.length === 0) return null;
              return (
                <section key={batch.fetchedAt} className="grid">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
                    <span className="text-base">
                      {formatDateTime.format(new Date(batch.fetchedAt))}
                    </span>
                    <span className="text-base text-neutral-500">{entries.length} entries</span>
                  </div>
                  {entries.map((entry) =>
                    digestSources.has(entry.sourceName) ? (
                      <article
                        key={entry.url}
                        className="grid grid-cols-[96px_1fr] gap-4 border-b border-neutral-100 py-4"
                      >
                        {entry.ogImage ? (
                          <img
                            src={entry.ogImage}
                            alt=""
                            className="h-16 w-24 rounded-sm object-cover"
                          />
                        ) : (
                          <div className="h-16 w-24 rounded-sm bg-neutral-100" aria-hidden="true" />
                        )}
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500">{entry.sourceName}</span>
                            <span className="text-sm text-neutral-500">{entry.publishedAt}</span>
                            <span className="text-sm text-neutral-500">{entry.title}</span>
                          </div>
                          <ul className="grid list-disc gap-1 pl-5">
                            {parseSummaryLines(entry.summary).map((item) => (
                              <li key={item.url} className="text-sm leading-relaxed">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  {item.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ) : (
                      <article
                        key={entry.url}
                        className="grid grid-cols-[96px_1fr] gap-4 border-b border-neutral-100 py-4"
                      >
                        {entry.ogImage ? (
                          <img
                            src={entry.ogImage}
                            alt=""
                            className="h-16 w-24 rounded-sm object-cover"
                          />
                        ) : (
                          <div className="h-16 w-24 rounded-sm bg-neutral-100" aria-hidden="true" />
                        )}
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500">{entry.sourceName}</span>
                            <span className="text-sm text-neutral-500">{entry.publishedAt}</span>
                          </div>
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base leading-snug"
                          >
                            {entry.title}
                          </a>
                          {entry.summary && (
                            <p className="line-clamp-2 text-sm leading-relaxed">
                              {entry.summary.slice(0, 200)}
                            </p>
                          )}
                        </div>
                      </article>
                    ),
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
