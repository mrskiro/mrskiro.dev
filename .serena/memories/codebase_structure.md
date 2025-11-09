# コードベース構造

## ルートディレクトリ構成

```
mrskiro.dev/
├── src/                  # ソースコード
├── public/              # 静的ファイル（画像、アイコン等）
├── .github/             # GitHub Actions ワークフロー
├── .storybook/          # Storybook設定
├── playwright/          # E2Eテスト設定
├── CLAUDE.md            # プロジェクトドキュメント（AIアシスタント用）
├── package.json         # 依存関係とスクリプト
├── tsconfig.json        # TypeScript設定
├── tailwind.config.ts   # Tailwind CSS設定
├── next.config.js       # Next.js設定
└── .env.local           # 環境変数（Git管理外）
```

## src/ ディレクトリ詳細

### アーキテクチャパターン
**Feature-based organization**: 機能ごとに自己完結したモジュールとして整理

```
src/
├── app/                 # Next.js App Router（ページ定義）
├── features/           # 機能モジュール
├── components/         # 共通コンポーネント
├── layouts/            # レイアウトコンポーネント
├── lib/                # ユーティリティライブラリ
├── styles/             # グローバルスタイル
└── test/               # テストユーティリティ
```

### app/ - Next.js App Router

```
app/
├── layout.tsx           # ルートレイアウト
├── page.tsx            # トップページ (/)
├── error.tsx           # エラーページ
├── not-found.tsx       # 404ページ
├── posts/
│   └── [param]/
│       └── page.tsx    # ブログ記事詳細 (/posts/:param)
├── about/
│   └── page.tsx        # Aboutページ (/about)
└── test/
    └── page.tsx        # テストページ (/test)
```

**重要**: App Routerに移行済み（以前はPages Router）

### features/ - 機能モジュール

各機能は以下の構造を持つ:
- `api/`: データ取得・API呼び出し
- `components/`: 機能専用コンポーネント
- `types/`: 型定義
- `utils/`: ユーティリティ関数

#### post/ - ブログ記事機能

```
features/post/
├── api/
│   ├── api.ts          # Notion API連携、RSS取得
│   └── index.ts        # バレルファイル（削除予定）
├── components/
│   ├── posts/          # 記事一覧コンポーネント
│   ├── post-detail/    # 記事詳細コンポーネント
│   │   └── block/      # Notionブロックレンダリング
│   │       ├── paragraph/
│   │       ├── heading/
│   │       ├── code/
│   │       ├── image/
│   │       ├── bulleted-list/
│   │       ├── numbered-list/
│   │       └── rich-text/
│   └── table-of-contents/  # 目次コンポーネント
├── types/
│   ├── post.ts         # Post型定義
│   ├── block.ts        # Notionブロック型定義
│   └── index.ts        # バレルファイル（削除予定）
└── utils/
    ├── utils.ts        # 記事関連ユーティリティ
    └── index.ts        # バレルファイル（削除予定）
```

#### theme/ - テーマ切り替え機能

```
features/theme/
├── context.tsx         # テーマコンテキスト
└── components/
    └── switcher/
        └── index.tsx   # テーマスイッチャーコンポーネント
```

### components/ - 共通コンポーネント

```
components/
├── app-link/           # アプリケーション内リンク
├── sr-only/            # スクリーンリーダー専用テキスト
└── error-boundary/     # エラーバウンダリー
    ├── error-boundary.tsx
    ├── error-boundary.test.tsx
    └── __snapshots__/
```

### layouts/ - レイアウトコンポーネント

```
layouts/
├── components/
│   ├── header/         # ヘッダー
│   └── footer/         # フッター
├── three-column/       # 3カラムレイアウト
└── two-column/         # 2カラムレイアウト
```

### lib/ - ユーティリティライブラリ

```
lib/
├── notion/             # Notion API連携
├── parser/
│   └── rss/            # RSSパーサー
├── config/             # 設定値
├── date/               # 日付ユーティリティ
├── style/              # スタイルユーティリティ（cn関数等）
├── image/              # 画像処理
├── environment/        # 環境変数管理
├── log/                # ロギング
├── bmc/                # Buy Me a Coffee統合
└── error/
    └── use-throw-error/  # エラースロー用フック
```

### test/ - テストユーティリティ

```
test/
├── setup.ts            # Jest設定
├── utils.tsx           # テストユーティリティ
└── mock-next-router.ts # Next.js Routerモック
```

## 設計パターンとベストプラクティス

### 1. Feature-based organization
各機能は自己完結し、以下を含む:
- データ取得ロジック (api/)
- UI コンポーネント (components/)
- 型定義 (types/)
- ユーティリティ (utils/)

### 2. レイアウト分離
レイアウトコンポーネント（header, footer等）はビジネスロジックから分離

### 3. Notion統合
- 記事とAboutページのコンテンツはNotion APIから取得
- ブロック単位でレンダリング（paragraph, heading, code等）

### 4. RSS統合
外部記事（Qiita, Zenn）をRSSフィードで取得・表示

### 5. テーマシステム
- ダーク/ライトテーマ
- システム設定の検出
- localStorageでの永続化

## パスエイリアス

TypeScript設定により、`@/*`で`src/*`を参照可能:

```typescript
// ❌ 相対パス
import { Post } from '../../../features/post/types';

// ✅ パスエイリアス
import { Post } from '@/features/post/types';
```

## バレルファイル問題

**現状**: 41個の`index.ts/tsx`ファイルが再エクスポートに使用されている

**問題点**:
- ユーザー設定（CLAUDE.md）に違反
- バンドルサイズの増加
- 不要な間接参照

**対応**: 段階的に削除し、直接インポートに置き換える
