import Link from "next/link";

import { getPosts } from "@/lib/posts";

const projects = [
  {
    name: "Calect",
    description: "Sync your calendars",
    url: "https://calect.com",
  },
  {
    name: "Stint",
    description: "Sit/stand reminders for macOS",
    url: "https://github.com/mrskiro/stint",
  },
];

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="grid gap-12">
      <section className="grid gap-4">
        <h1 className="font-semibold">mrskiro</h1>
        <p>
          Software Engineer from Japan.
          <br />
          Indie hacker building things around UI/UX and AI.
          <br />
          Find me on <a href="https://github.com/mrskiro">GitHub</a>,{" "}
          <a href="https://x.com/mrskiro_">X</a>, or reach out via{" "}
          <a href="mailto:mrskiro.h@gmail.com">email</a>.
        </p>
      </section>

      <section className="grid gap-4">
        <h2 className="font-semibold">Projects</h2>
        <ul className="grid gap-2">
          {projects.map((project) => (
            <li key={project.name} className="flex gap-2">
              <a href={project.url} target="_blank">
                {project.name} ↗
              </a>
              <span>·</span>
              <span>{project.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Writing</h2>
          <Link href="/writing">All writing →</Link>
        </div>
        <ul className="grid gap-2">
          {posts.slice(0, 3).map(({ slug, frontmatter }) => (
            <li key={slug} className="flex gap-4">
              <time dateTime={frontmatter.date} className="shrink-0 font-mono">
                {frontmatter.date}
              </time>
              <Link href={`/writing/${slug}`}>{frontmatter.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-4">
        <Link href="/uses">Uses</Link>
        <Link href="/colophon">Colophon</Link>
      </div>
    </div>
  );
}
