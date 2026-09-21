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

## Deploy (Vercel)

- **The `packageManager` pin is load-bearing for deploys, not just for local and CI.** Vercel picks pnpm 12 only from a pin (`packageManager`, `devEngines.packageManager`, or `engines.pnpm`); an unpinned `lockfileVersion: 9.0` still resolves to pnpm 9 or 10 by project creation date. Drop the pin and deploys install with pnpm 10 against a pnpm 12 lockfile
- Deploys install through Vercel's own pnpm 12, which reached the build image on 2026-09-08 (`vercel/vercel@c628be78`: lockfiles are read with `safeLoadAll`, and `/pnpm12` ships in the image). The `ENABLE_EXPERIMENTAL_COREPACK=1` variable this project needed before that is gone from both environments — do not re-add it

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
