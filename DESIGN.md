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
- Dark mode: not planned (adds complexity; use `prefers-color-scheme` if ever needed)

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
- Heading hierarchy expressed via margin-block-start (H2: 56px, H3: 40px, H4: 32px)

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
- `/colophon` — Colophon (how this site is built)
- `/resume` — Resume (optional)

## Tategaki (Vertical Writing)

Reference: W3C jlreq (Requirements for Japanese Text Layout), CSS Writing Modes Level 4

### Scope & Toggle

- Article detail only (`/writing/[slug]`)
- Toggle: `tb-rl` / `lr-tb` link in top-right — plain link style (accent underline), no button/toggle UI
- URL changes on switch (e.g. `?tategaki`), preference saved in `localStorage`
- Mobile: horizontal writing only (no toggle shown)

### Container

- `writing-mode: vertical-rl` — 右から左への縦書き（日本語標準）
- `text-orientation: mixed` — 日本語は正立、英数字は横倒し（時計回り90度）
- Horizontal scroll (`overflow-x: auto`, `overflow-y: hidden`)
- Height: `calc(100dvh - 10rem)` for viewport-fitted reading

### Typography

- Use logical properties (`mbs-*`, `mbe-*`, `ps-*`, `border-s-*`) — writing-mode 両対応
- Override mechanism: `data-tategaki` attribute on container + Tailwind `group-data-[tategaki]:` variant
- line-height: 1.8–2.0 recommended for vertical (横書きより広めが読みやすい。jlreq: 0.5em–1em line gap)
- letter-spacing: default (no change)
- `line-break: strict` — 禁則処理を有効化。句読点・閉じ括弧が行頭に来ることを禁止
- `overflow-wrap: anywhere` — 長い英単語・URLの折り返し

### Paragraph

- Paragraph spacing: 0 in vertical mode
- `text-indent: 1em` — 段落冒頭の字下げで段落を区切る（jlreq準拠。余白ではなくインデントで段落を表現）

### Heading

- Spacing (block-start): H2 `mbs-8`, H3 `mbs-6`, H4 `mbs-4` — 横書きの約半分
- Spacing (block-end): same as horizontal (H2 `mbe-4`, H3 `mbe-3`, H4 `mbe-2`)
- 見出しも縦書きのまま（横書きに切り替えない）

### Numbers — 縦中横 (text-combine-upright)

縦書きで最も重要なタイポグラフィ処理。連続する数字を1文字幅に横並びで表示する。

- **2桁の数字**: `text-combine-upright: all` で縦中横にする（例: 12月, 26日, v2）
- **3桁以上の数字**: 縦中横にしない（1文字幅に圧縮され可読性が低下）
- **1桁の数字**: そのまま正立表示（処理不要）
- `digits` 値はブラウザ未実装のため、`<span>` + `all` で手動マークアップ
- **実装**: `src/lib/tcy.tsx` — React children を走査して2桁数字を `<span>` で囲む関数。MDX要素（p, h2-h4, li）に適用。Turbopack が rehype プラグイン（関数）をシリアライズできないため React レベルで処理

### English / Alphabet

- `text-orientation: mixed` で英単語は横倒しで表示される — これが最も自然
- 短い略語（AM, PM等）で正立させたい場合は `text-combine-upright: all`
- 長い英文が続く場合は横書き島（`writing-mode: horizontal-tb`）として分離

### Links

縦書きでは `text-decoration: underline` が傍線（文字の横に引かれる線）になる。

- `text-underline-position: left` — リンクの線は左側に配置
  - 右側はルビ・傍点（強調）の領域。HTMLのリンク下線はインタラクション指標であり、日本語組版の傍線（強調）とは役割が異なるため、左側に分離する
- `text-underline-offset` は横書きと同じ値でよい
- ホバー表現: `text-decoration-color` の変更が最も安全

### Punctuation / 約物

- `writing-mode: vertical-rl` で句読点（、。）・括弧（「」『』）は自動的に縦書き位置に回転
- 追加CSSは基本不要（フォントの vert OpenType機能で処理される）
- 約物の詰め処理（任意）: `font-feature-settings: "vchw" 1` で連続約物の半角化

### Horizontal Islands — 横書き島

縦書きの中で横書きにすべき要素:

- **Code blocks** (`<pre>`): `writing-mode: horizontal-tb` — コードは常に横書き
- **Tables** (`<table>`): `writing-mode: horizontal-tb` — テーブルは縦書きで破綻する

### Images

- 画像自体は回転しない（`writing-mode` は画像内容に影響しない）
- `max-height: calc(100dvh - 12rem)` + `width: auto` でコンテナ高さに制限し、アスペクト比を維持
- MDXの `<img>` は `<p>` に包まれるため、パーセンテージベースの論理プロパティ（`max-inline-size: 100%`）は効かない。物理値で直接指定する

### Lists

- `<ul>` / `<ol>` は縦書きを継承してそのまま動作する
- リストマーカーも自動的に縦書き方向に配置される
- 番号付きリストの2桁以上の番号は横倒しになるが、`::marker` への `text-combine-upright` はブラウザ対応が限定的

### Font

- System font stack を維持（サイト全体のポリシーに従う）
- 明朝体は縦書きとの相性が良いが、サイトのミニマル方針と矛盾するため変更しない
- システムフォントでも縦書きOpenType機能（vert）は十分に動作する

### Browser Compatibility

- `writing-mode: vertical-rl`, `text-orientation`, `text-combine-upright: all` は主要ブラウザすべてで対応済み
- `text-combine-upright: digits` は全ブラウザ未実装（使わない）
- Safari: `-webkit-text-combine: horizontal` をフォールバックとして指定
- Firefox: Flexbox内の縦書きにバグあり — Blockレイアウトを使う方が安全

## Interactive UI

- Site has no buttons or toggles — all interactions are links
- Actions that change URL are links, styled identically to navigation links
- No special UI patterns (no icons, no toggles, no switches)

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
