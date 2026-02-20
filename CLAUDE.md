# CLAUDE.md

## Tech Stack

- Framework: Next.js 16 (App Router) + TypeScript
- Styling: Tailwind CSS v4
- Content: MDX via @next/mdx, articles in `contents/writing/*.mdx`
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
- Reference/inspiration sites go in DESIGN.md Colophon section (public is OK as colophon)
- `/tmp` directory for local-only files (gitignored)

## Design

- `design.pen` is encrypted — use Pencil MCP tools only, not Read/Grep
- `DESIGN.md` for design principles and decisions
- All design values (font size, spacing, width) must use Tailwind standard scale
- Set design tokens (variables) in Pencil BEFORE creating design nodes
- Pencil: `replace_all_matching_properties` escapes `$` in variable refs — use `batch_design` `U()` instead
- Use browser_eval screenshots when researching reference sites visually

## Coding Conventions

- Next.js convention files (page, layout, not-found, sitemap etc.) use `export default function` (exception to arrow function rule)
- Always colocate export with definition — never separate `const foo = ...` then `export { foo }`

## Project Structure

- Articles: `contents/writing/*.mdx` (repository root)
- MDX prose styles: `mdx-components.tsx` (Tailwind classes per element)
- Pages: `src/app/`

## Development

- Start dev server in background, then verify with browser_eval (Chrome)
- Next.js API/conventions: always check Next.js MCP docs (`nextjs_docs`) before implementing
