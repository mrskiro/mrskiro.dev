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
- `pnpm test` for vitest

## MDX

- Turbopack serializes @next/mdx plugin options. Functions cause build errors — only use string (package name) for rehype/remark plugins. For local plugins, process at React component level instead

## CI

- GitHub Actions: format, lint, typecheck, test, build run in parallel
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

- Keep globals.css minimal — no custom classes. Use Tailwind className (arbitrary properties, variants, `group-data-*` etc.) instead
- `design.pen` is encrypted — use Pencil MCP tools only, not Read/Grep
- `DESIGN.md` for design principles and decisions
- All design values (font size, spacing, width) must use Tailwind standard scale
- Set design tokens (variables) in Pencil BEFORE creating design nodes
- Pencil: `replace_all_matching_properties` escapes `$` in variable refs — use `batch_design` `U()` instead
- Use browser_eval screenshots when researching reference sites visually
- Pencil: 新スクリーン作成前に `get_variables` と既存スクリーンの `batch_get` でテーマ変数・スタイルパターンを確認し、色はハードコードせず変数（`$text-primary` 等）を使う
- デザイン案を出すとき、DESIGN.md の原則（フォントサイズ、色、リンクスタイル等）を最初に確認してから作業する
- Pencil: コピー(C)したノードの子はIDが変わる。子を変更するにはコピー後に `batch_get` でIDを再取得する
- Pencil: Move(M) の nodeId にバインディング変数は使えない。IDを直接指定する

## Coding Conventions

- Next.js convention files (page, layout, not-found, sitemap etc.) use `export default function` (exception to arrow function rule)
- Always colocate export with definition — never separate `const foo = ...` then `export { foo }`
- Tategaki conditional styles: use `data-tategaki` attribute on container with Tailwind `group` + `group-data-[tategaki]:` variant (not CSS class selector)
- Before using Tailwind arbitrary properties (`[property:value]`), always check context7 docs for existing utility classes (e.g. `wrap-anywhere` not `[overflow-wrap:anywhere]`, `max-inline-full` not `max-is-full`)

## Project Structure

- Articles: `contents/writing/*.mdx` (repository root)
- MDX prose styles: `mdx-components.tsx` (Tailwind classes per element)
- Pages: `src/app/`
- OGP image: `src/app/opengraph-image.tsx` (`next/og` ImageResponse, all pages share one image)
- Favicon: `src/app/icon.png` (32x32), `src/app/apple-icon.png` (180x180) — pixel cat

## Development

- Start dev server in background, then verify with browser_eval (Chrome)
- Next.js API/conventions: always check Next.js MCP docs (`nextjs_docs`) before implementing
- Never rely on training knowledge — always fetch latest docs via context7 or Next.js MCP before writing code
