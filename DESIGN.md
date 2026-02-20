# Design Requirements

## Impression

- Dead simple — goal is to be featured on deadsimplesites.com
- Close to raw HTML with minimal CSS decoration
- A touch of geekiness
- See Colophon section for inspirations

## Design Principles

- Follow defaults, minimize customization
- Reproducibility and understandability over personalization
- Maintenance-minimal

## Layout

- Content max-width: `max-w-xl` (576px), centered with `mx-auto`
- All spacing values align to Tailwind standard scale

## Color

- Text: `#000000` (browser default) — one color for all text
- Background: `#FFFFFF` (browser default)
- Accent: `#aa26ff` (purple — personal identity, links and emphasis)
- Code block background: `#F6F6F6`
- Border: `#F0F0F0`
- Dark mode: later

## Typography

- System font stack (no web fonts)
- Single font size: 16px (`text-base`) for all text
- font-weight: 400 for body, 500 for headings only
- Dates: monospace font for geeky feel
- Display name: "mrskiro" (not real name)

## Spacing

- 8px (`gap-2`): tight spacing within rows
- 16px (`gap-4`): standard gap, row padding
- 48px (`p-12`): section spacing, page top/bottom
- Heading hierarchy expressed via margin-top (H2: 56px, H3: 40px, H4: 32px)

## Links

- All links: black text + underline in accent color (`#aa26ff`)
- `text-underline-offset: 2.5px`
- Consistent — no exceptions for any link type

## Emphasis

- `<strong>` in MDX: no bold, accent color text instead (font-weight stays 400)

## Key Design Decisions

- No header/nav — Writing link via "All writing"
- No footer
- No "hero" concept — content flows naturally
- SNS links embedded in bio text (not separate row)
- `↗` symbol for external links
- Writing dates on the left in monospace
- Section dividers: whitespace only (no borders, no lines)
- Section headings are plain text, not styled labels

## Pages

- `/` — Home (single page, all key info)
- `/writing` — Article list
- `/writing/[slug]` — Article detail
- `/resume` — Resume (optional)

## Visual Direction

- Minimalist, text-centric
- No shadows, no rounded corners
- No decorative CSS — as close to unstyled HTML as possible
- Animations: almost none (hover only, subtle)
- Images: avatar only, minimal

## i18n

- Japanese-first, multilingual later (AI translation)

## Target Audience

- Other engineers, potential collaborators, indie hacker community
- Both Japanese and international

## Colophon

- Framework: Next.js (App Router) + TypeScript
- Styling: Tailwind CSS v4
- Content: MDX
- Deployment: Vercel
- Inspired by: alexandersandberg.com, paco.me, henribredt.de, johnnyrodgers.is, marxz.me
- Curated gallery: deadsimplesites.com

## Design File

- Mockup: `design.pen` (Pencil)
- Note: link underlines not representable in Pencil — apply via CSS in implementation
