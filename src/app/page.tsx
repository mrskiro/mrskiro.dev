import { readdir } from "fs/promises";
import Link from "next/link";

const projects = [
  {
    name: "Calect",
    description: "Sync your calendars",
    url: "https://calect.com",
  },
];

const getPosts = async () => {
  const files = await readdir("contents/writing");
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const { frontmatter } = await import(`contents/writing/${slug}.mdx`);
        return { slug, frontmatter: frontmatter as { title: string; date: string } };
      }),
  );
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <div className="grid gap-12">
      <section className="grid gap-4">
        <h1 className="font-medium">mrskiro</h1>
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
        <h2 className="font-medium">Projects</h2>
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
          <h2 className="font-medium">Writing</h2>
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
    </div>
  );
}
