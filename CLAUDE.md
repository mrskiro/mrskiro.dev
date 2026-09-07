# CLAUDE.md

## Commands

- `pnpm lint` and `pnpm format:check` to verify
- `pnpm typecheck` — build skips type checking
- `pnpm test`
- `pnpm format` before committing

## MDX

- Articles live in `contents/writing/*.mdx`
- Turbopack serializes @next/mdx plugin options. Functions cause build errors — only use string (package name) for rehype/remark plugins. For local plugins, process at React component level instead

## Repository

- Public repo — never commit secrets, personal URLs, or reference site lists
- Reference/inspiration sites go in DESIGN.md Colophon section

## Deploy (Vercel) — pnpm 12 constraints

Vercel's zero-config detection tops out at pnpm 10, which imposes two constraints:

- **`ENABLE_EXPERIMENTAL_COREPACK=1` project env var is required.** Vercel parses the lockfile with `js-yaml.safeLoad`, which throws on pnpm 12's multi-document lockfile, so the pnpm branch is skipped and detection falls through to the `packageManager` field — resolving to `npm` unless corepack is on. Without it a deploy installs with **npm against a repo that has no `package-lock.json`**, leaving transitive deps unpinned. It goes green, and it is wrong. Keep it until Vercel supports pnpm 11+ natively ([vercel/vercel#17434](https://github.com/vercel/vercel/issues/17434))
- **Do not pin pnpm below 12.3.4.** Vercel's build appends `--unsafe-perm` to `pnpm install`; pnpm 12.0–12.3.3 rejected unknown flags and failed every deploy. 12.3.4 restored the flag ([pnpm#14346](https://github.com/pnpm/pnpm/issues/14346)). No `vercel.json` override is needed at 12.3.4+

## Design

- Keep globals.css minimal — no custom classes. Use Tailwind className (arbitrary properties, variants, `group-data-*` etc.) instead
- `design.pen` is encrypted — use Pencil MCP tools only, not Read/Grep
- Before proposing design changes, read DESIGN.md principles (font size, color, link style) first

## Coding Conventions

- Next.js convention files (page, layout, not-found, sitemap etc.) use `export default function` (exception to arrow function rule). Function name is the generic convention name (`Layout`, `Page`, `NotFound` etc.)
- Tategaki conditional styles: use `data-tategaki` attribute on container with Tailwind `group/tategaki` + `group-data-[tategaki]/tategaki:` variant (not CSS class selector)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
