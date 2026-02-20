# Design Requirements

## Impression

- Refined, quiet, subtractive aesthetics
- Attention to detail that conveys technical skill
- A touch of geekiness — not overly decorated, but not bare HTML either
- The balance between "minimal sophistication" and "developer rawness"

## Design Principles

- Follow defaults, minimize customization
- Reproducibility and understandability over personalization
- Maintenance-minimal

## Color

- Base: Monochrome (light mode)
- Primary accent: `#aa26ff` (purple — personal identity, used for links)
- Text primary: `#000000`
- Text secondary: `#999999`
- Text tertiary: `#C4C4C4`
- Background: `#FFFFFF`
- Dark mode: later

## Typography

- System font stack (no web fonts)
- Name: 56px, weight 300 (light), letter-spacing -2px
- Section labels: 11px, weight 500, uppercase, letter-spacing 2px
- Body: 18px, weight 400, line-height 1.7
- List items: 15px
- Dates: monospace font for geeky feel

## Key Design Decisions

- No header/nav — Blog link via "All posts →"
- No footer
- No "hero" concept — content flows naturally
- SNS links embedded in bio text (not separate row)
- `↗` symbol for external links
- Blog dates on the left in monospace
- Section dividers: whitespace only (no borders, no lines)

## Pages

- `/` — Home (single page, all key info)
- `/blog` — Article list
- `/blog/[slug]` — Article detail

## Visual Direction

- Minimalist, text-centric
- Sharp corners (0px radius everywhere)
- No shadows
- No decorative color — accent purple only for interactive elements
- Animations: almost none (hover only, subtle)
- Images: avatar only, minimal
- Generous whitespace between sections

## i18n

- Japanese-first, multilingual later (AI translation)

## Target Audience

- Other engineers, potential collaborators, indie hacker community
- Both Japanese and international

## Design File

- Mockup: `design.pen` (Pencil)
