# CLAUDE.md

## Tech Stack

- Framework: Next.js 16 (App Router) + TypeScript
- Styling: Tailwind CSS v4
- Content: MDX via @next/mdx, blog posts in `contents/blog/*.mdx`
- Deployment: Vercel

## Tooling

- Linter: oxlint (not ESLint) — config: .oxlintrc.json
- Formatter: oxfmt (not Prettier) — config: .oxfmtrc.json
- Run `pnpm lint` and `pnpm format:check` to verify
- `pnpm typecheck` for TypeScript (build skips type checking)

## CI

- GitHub Actions: format, lint, typecheck, build run in parallel
- Composite action at .github/actions/setup/

## Commands

- Claude runs non-interactive commands (pnpm install, git operations, etc.)
- User runs interactive CLIs (prompts/wizards like create-next-app)
- NEVER commit without explicit user instruction

## Repository

- Public repo — never commit secrets, personal URLs, or reference site lists
- `/tmp` directory for local-only files (gitignored)

## Design

- `design.pen` is encrypted — use Pencil MCP tools only, not Read/Grep
- `DESIGN.md` for design principles and decisions

## Coding Conventions

- Next.js page components use `export default function Page()` (exception to arrow function rule)

## Project Structure

- Blog posts: `contents/blog/*.mdx` (repository root)
- Pages: `src/app/`

## Development

- Start dev server in background, then verify with browser_eval (Chrome)
