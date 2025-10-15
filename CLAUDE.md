# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mrskiro.dev is a personal portfolio and blog site built with Next.js (Pages Router) and Notion API integration. The site features a dark/light theme toggle, blog posts fetched from Notion, and RSS feed aggregation from Qiita and Zenn.

## Tech Stack

- **Framework**: Next.js 15.0.4 with Pages Router
- **Language**: TypeScript 5.1.6 (strict mode enabled)
- **UI Library**: React 19.0.0, React DOM 19.0.0
- **Styling**: Tailwind CSS 3.4.14 + tailwind-merge 2.5.4 + clsx 2.1.1
- **CMS**: Notion API (@notionhq/client 2.2.3)
- **Monitoring**: Sentry (@sentry/nextjs 7.50.0)
- **Package Manager**: yarn (Note: User's global preferences specify pnpm)
- **Testing**: Jest 29.5.0 + Playwright 1.30.0 + @testing-library/react 14.0.0
- **Component Development**: Storybook 7.0.9
- **Linting**: ESLint 9.16.0 + typescript-eslint 8.17.0 + markuplint 3.7.0 + ls-lint 2.0.0 + oxlint 1.23.0
- **Other**: prismjs 1.28.0 (syntax highlighting), rss-parser 3.12.0 (RSS feeds), react-icons 4.4.0

## Development Commands

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server

# Testing
yarn test         # Run Jest unit tests
yarn test:e2e     # Run Playwright E2E tests
yarn update-snapshots  # Update test snapshots

# Linting (very strict rules)
yarn lint         # Run all linters in parallel
yarn lint:eslint  # ESLint check
yarn lint:eslint:fix  # ESLint auto-fix
yarn lint:tsc     # TypeScript type checking
yarn lint:html    # Markuplint for JSX/HTML
yarn lint:ls      # File naming convention check

# Component Development
yarn storybook    # Start Storybook
```

## Architecture

### Directory Structure
```
src/
├── components/       # Shared components
├── features/        # Feature modules (post, theme)
│   └── [feature]/
│       ├── api/
│       ├── components/
│       ├── types/
│       └── utils/
├── layouts/         # Layout components
├── lib/            # Utilities (notion, config, date, etc.)
├── pages/          # Next.js pages
└── styles/         # Global styles
```

### Key Patterns

1. **Feature-based organization**: Each feature (post, theme) is self-contained with its own api, components, types, and utils
2. **Layout separation**: Layout components (header, footer, column layouts) are separate from business logic
3. **Notion Integration**: Posts and about page content are fetched from Notion API
4. **RSS Aggregation**: External posts from Qiita and Zenn are fetched via RSS feeds
5. **Theme System**: Dark/light theme with system preference detection and localStorage persistence

### Important Configurations

**TypeScript** (`tsconfig.json`):
- Strict mode enabled
- noUncheckedIndexedAccess: true
- Path alias: `@/*` maps to `src/*`

**ESLint** (`eslint.config.mjs`):
- Max complexity: 16
- Max file lines: 1000
- Max function lines: 300
- Max parameters: 3
- Enforces arrow functions
- Prohibits nested ternary operators

**File Naming** (`.ls-lint.yml`):
- Default: kebab-case
- Components: kebab-case.tsx
- Pages: kebab-case or [param] or _app

## Environment Variables

Required in `.env.local`:
```
NOTION_TOKEN=          # Notion API authentication
QIITA_URL=            # Qiita RSS feed URL
ZENN_URL=             # Zenn RSS feed URL
ABOUT_PAGE_ID=        # Notion page ID for About page
```

Optional:
```
SENTRY_ORG=           # Sentry organization
SENTRY_PROJECT=       # Sentry project
```

## Known Issues and TODOs

1. **Barrel files**: The codebase currently uses 41 index.ts/tsx files for re-exports, which violates the user's global preferences. These should be removed gradually.

2. **Package manager**: Currently using yarn, but user preferences specify pnpm.

3. **Outdated dependencies**: Several major dependencies need updates (see roadmap.md for details):
   - @notionhq/client: 2.2.3 → 5.2.0
   - @sentry/nextjs: 7.50.0 → 10.19.0
   - Storybook: 7.0.9 → 9.1.10

## Testing Strategy

- **Unit tests**: Jest with @testing-library/react for component testing
- **E2E tests**: Playwright for cross-browser testing (Chromium, WebKit, Mobile)
- **Visual regression**: Chromatic integration with Storybook
- **Accessibility**: jest-axe for automated accessibility testing

## CI/CD

GitHub Actions workflows:
- `ci.yml`: Runs linting, type checking, and tests
- `chromatic.yml`: Visual regression testing with Storybook
- `claude.yml`: Claude PR Assistant for automated code review
- `e2e-on-vercel-preview.yml`: E2E tests on Vercel preview deployments

## Code Style Guidelines

When working in this codebase:
1. Use `type` instead of `interface`
2. Prefer arrow functions over function declarations
3. Use named exports (no default exports except for pages)
4. Avoid variable declarations unless referenced multiple times
5. Use Tailwind `gap` instead of `space-y` utilities
6. Prefer grid-first layout approach
7. Components should not know their layout context (parent elements)
8. Never use `any` type - use proper typing or `unknown`