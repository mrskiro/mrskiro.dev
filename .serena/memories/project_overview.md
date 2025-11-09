# プロジェクト概要

## プロジェクト名
mrskiro.dev

## 目的
個人ポートフォリオおよびブログサイト。Notion APIと連携し、ブログ記事を管理・表示する。

## 主要機能
- **ダーク/ライトテーマ切り替え**: システム設定の検出とlocalStorageでの永続化
- **Notion連携ブログ**: Notion APIからブログ記事を取得して表示
- **RSSフィード統合**: QiitaとZennの外部記事をRSSフィードで取得・表示
- **About ページ**: Notionページから取得したコンテンツを表示
- **シンタックスハイライト**: prismjsによるコードブロックの表示
- **レスポンシブデザイン**: Tailwind CSSによるモバイル対応

## デプロイ
- **プラットフォーム**: Vercel
- **CI/CD**: GitHub Actions (linting, テスト, E2E, Chromatic)
- **モニタリング**: Sentry

## 環境変数
必須:
- `NOTION_TOKEN`: Notion API認証
- `QIITA_URL`: Qiita RSSフィードURL
- `ZENN_URL`: Zenn RSSフィードURL
- `ABOUT_PAGE_ID`: AboutページのNotion ID

オプション:
- `SENTRY_ORG`: Sentry組織
- `SENTRY_PROJECT`: Sentryプロジェクト
