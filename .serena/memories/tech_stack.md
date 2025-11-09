# 技術スタック

## フレームワーク・ライブラリ
- **Next.js**: 15.0.4 (App Router)
- **React**: 19.0.0
- **React DOM**: 19.0.0
- **TypeScript**: 5.1.6 (strictモード有効)

## スタイリング
- **Tailwind CSS**: 3.4.14
- **tailwind-merge**: 2.5.4
- **clsx**: 2.1.1

## CMS・外部API
- **Notion API**: @notionhq/client 2.2.3
- **RSS Parser**: rss-parser 3.12.0 (Qiita/Zenn統合)

## モニタリング・エラー追跡
- **Sentry**: @sentry/nextjs 7.50.0

## UI・アイコン
- **React Icons**: react-icons 4.4.0
- **Prism.js**: prismjs 1.28.0 (シンタックスハイライト)

## パッケージマネージャ
- **pnpm**: 推奨パッケージマネージャ

## 開発ツール

### テスト
- **Jest**: 29.5.0
- **Testing Library**: @testing-library/react 14.0.0
- **Playwright**: 1.30.0 (E2Eテスト)
- **jest-axe**: アクセシビリティテスト

### コンポーネント開発
- **Storybook**: 7.0.9
- **Chromatic**: ビジュアルリグレッションテスト

### Linting・フォーマット
- **oxlint**: 1.23.0 (Rust製高速linter)
- **markuplint**: 3.7.0 (HTML/JSX)
- **ls-lint**: 2.0.0 (ファイル命名規則)

## TypeScript設定
- strictモード有効
- noUncheckedIndexedAccess: true
- パスエイリアス: `@/*` → `src/*`

## システム
- **OS**: macOS (Darwin 24.5.0)
- **Node.js**: 推奨バージョンの確認は`.nvmrc`または`package.json`の`engines`フィールドを参照
