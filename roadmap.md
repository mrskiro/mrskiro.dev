# mrskiro.dev 改善ロードマップ

> 最終更新: 2025-10-15

## 📊 プロジェクト現状分析

### 技術スタック

- **フレームワーク**: Next.js 15.0.4 (Pages Router)
- **言語**: TypeScript 5.1.6
- **UI**: React 19.0.0
- **スタイリング**: Tailwind CSS 3.4.14
- **CMS**: Notion API (@notionhq/client 2.2.3)
- **監視**: Sentry 7.50.0
- **テスト**: Jest 29.5.0, Playwright 1.30.0
- **開発**: Storybook 7.0.9
- **パッケージマネージャー**: yarn (規約ではpnpm推奨)

### コードベース規模

- TypeScript/TSXファイル: 81個
- バレルファイル(index.ts/tsx): 41個
- Storybookストーリー: 2個
- テストファイル: 6個
- node_modules: 960MB

### ✅ 良い点

1. **コーディング規約への高い準拠度**
   - `type`を使用（`interface`は不使用）✓
   - arrow functionを使用 ✓
   - Tailwindで`gap`を使用（`space-y`不使用）✓
   - ESLintエラー: 0件 ✓
   - TypeScript型エラー: 0件 ✓

2. **充実したツール設定**
   - 厳格なESLint設定（複雑度・最大行数制限）
   - CI/CD完備（lint, test, commitlint）
   - 品質ツール（markuplint, ls-lint）

3. **管理しやすい規模**
   - 小〜中規模で見通しが良い

---

## ⚠️ 問題点

### 🔴 重大度: 高

#### 1. 依存関係の深刻な古さ

| パッケージ       | 現在   | 最新    | 差分      |
| ---------------- | ------ | ------- | --------- |
| Storybook        | 7.0.9  | 9.1.10  | +2 major  |
| @notionhq/client | 2.2.3  | 5.2.0   | +3 major  |
| @sentry/nextjs   | 7.50.0 | 10.19.0 | +3 major  |
| Jest             | 29.5.0 | 30.2.0  | +1 major  |
| @playwright/test | 1.30.0 | 1.56.0  | +26 minor |
| Next.js          | 15.0.4 | 15.5.5  | +5 patch  |
| React            | 19.0.0 | 19.2.0  | +2 patch  |

**その他30個以上**のパッケージで更新が必要

**リスク**:

- セキュリティ脆弱性の存在
- バグ・互換性問題
- 新機能の利用不可
- コミュニティサポート低下

### 🟡 重大度: 中

#### 2. バレルファイルの多用（41個）

**問題点**:

- ビルド時間の増加
- Tree-shakingの妨げ
- コードジャンプの複雑化
- **規約違反**（バレルファイル禁止）

#### 3. Pages Router使用

Next.js 13以降はApp Routerが標準。

**App Router移行のメリット**:

- React Server Componentsの活用
- より柔軟なルーティング
- ストリーミング・Suspenseのネイティブサポート
- パフォーマンス向上

#### 4. パッケージマネージャー不一致

- 現在: yarn
- 規約: pnpm

### 🟢 重大度: 低

#### 5. その他の軽微な問題

- [ ] 環境変数未設定（.env未作成）→ ビルド失敗
- [ ] Browserslistデータが12ヶ月古い
- [ ] Storybookストーリー不足（2個のみ）
- [ ] TODOコメント残存（`src/features/post/components/posts/components/post-item/index.tsx:24`）
- [ ] oxlint導入済みだが未設定

---

## 🛡️ 段階的改善プラン

### ステップ1: リスクゼロ（デプロイに影響なし）

**対象**: 開発環境のみの変更

- [ ] **1.1 環境変数の設定**
  - .envファイル作成
  - 必要な環境変数設定（Notion API、Sentry、QiitaURL、ZennURL等）
  - ローカルビルド成功確認
  - **検証**: `yarn build`

- [ ] **1.2 Browserslistの更新**

  ```bash
  npx update-browserslist-db@latest
  ```

  - **検証**: 警告メッセージ消失確認

- [ ] **1.3 oxlintの設定**
  - 設定ファイル作成（`oxlint.json`）
  - npm scriptsに追加
  - ESLintと並行運用
  - **検証**: `pnpm oxlint`（導入後）

- [ ] **1.4 GitHub Actionsの改善**
  - actions/checkout: v3 → v4
  - actions/setup-node: v3 → v4
  - キャッシュ効率化
  - **検証**: CI通過確認

**リスク**: なし
**所要時間**: 1時間
**前提条件**: なし

---

### ステップ2: リスク極小（テストで確認可能）

**対象**: devDependenciesのマイナー・パッチアップデート

- [ ] **2.1 型定義ファイルの更新**
  - @types/node: 18.0.0 → 24.7.2
  - @types/react: 19.0.1 → 19.2.2
  - @types/react-dom: 19.0.1 → 19.2.2
  - @types/prismjs: 1.26.0 → 1.26.5
  - @types/jest-axe: 3.5.5 → 3.5.9
  - **検証**: `yarn lint:tsc`

- [ ] **2.2 Testing Library系の更新**
  - @testing-library/jest-dom: 5.16.5 → 6.9.1
  - @testing-library/react: 14.0.0 → 16.3.0
  - @testing-library/user-event: 14.4.3 → 14.6.1
  - **検証**: `yarn test`

- [ ] **2.3 Playwright更新**
  - @playwright/test: 1.30.0 → 1.56.0
  - **検証**: `yarn test:e2e`

- [ ] **2.4 Linter関連の更新**
  - autoprefixer: 10.4.20 → 10.4.21
  - eslint: 9.16.0 → 9.37.0
  - eslint-plugin-import: 2.31.0 → 2.32.0
  - eslint-plugin-react: 7.37.2 → 7.37.5
  - @typescript-eslint/eslint-plugin: 5.38.0 → 8.46.1
  - **検証**: `yarn lint`

- [ ] **2.5 その他開発ツール**
  - husky: 8.0.0 → 9.1.7
  - postcss: 8.4.47 → 8.5.6
  - **検証**: git commit時のフック動作確認

**リスク**: 極小（本番ビルドに含まれない）
**所要時間**: 2時間
**前提条件**: ステップ1完了

---

### ステップ3: リスク低（慎重に進める）

**対象**: dependenciesのパッチ・マイナーアップデート + コード改善

- [ ] **3.1 依存パッケージのパッチアップデート**
  - react: 19.0.0 → 19.2.0
  - react-dom: 19.0.0 → 19.2.0
  - prismjs: 1.28.0 → 1.30.0
  - rss-parser: 3.12.0 → 3.13.0
  - react-icons: 4.4.0 → 5.5.0
  - next-sitemap: 3.1.49 → 4.2.3
  - **検証**: ビルド + E2Eテスト + 本番環境での動作確認

- [ ] **3.2 Next.jsのマイナーアップデート**
  - next: 15.0.4 → 15.5.5
  - **検証**: ビルド + 全テスト + プレビュー環境デプロイ

- [ ] **3.3 バレルファイルの段階的削除**

  **フェーズ1**: 影響範囲が小さいものから
  - [ ] `features/theme` （テーマ切り替え機能）
  - [ ] `lib/date`, `lib/style`, `lib/bmc`
  - **検証**: ビルド + TypeScript型チェック

  **フェーズ2**: コンポーネント
  - [ ] `components/app-link`, `components/sr-only`
  - [ ] `layouts/components`
  - **検証**: ビルド + ビジュアルリグレッションテスト（Storybook）

  **フェーズ3**: 複雑な依存関係
  - [ ] `features/post/*`（多数のバレルファイル）
  - **検証**: ビルド + E2Eテスト

- [ ] **3.4 TODOコメントの解決**
  - `src/features/post/components/posts/components/post-item/index.tsx:24`
  - 「色変える」の実装または削除

**リスク**: 低
**所要時間**: 4〜6時間
**前提条件**: ステップ2完了

---

### ステップ4: リスク中（破壊的変更あり）

**対象**: メジャーバージョンアップ

- [ ] **4.1 Notion APIクライアント更新（要注意）**
  - @notionhq/client: 2.2.3 → 5.2.0
  - **破壊的変更**: APIインターフェースの大幅変更
  - **対応箇所**: `src/lib/notion/api.ts`, `src/features/post/api/*`
  - **検証**:
    - ローカルでNotion連携動作確認
    - 全記事取得テスト
    - E2Eテスト
    - プレビュー環境デプロイ

- [ ] **4.2 Sentry更新**
  - @sentry/nextjs: 7.50.0 → 10.19.0
  - **破壊的変更**: 設定ファイル構造変更
  - **対応箇所**: `sentry.*.config.ts`, `next.config.js`
  - **検証**: エラートラッキング動作確認

- [ ] **4.3 Jest更新**
  - jest: 29.5.0 → 30.2.0
  - jest-environment-jsdom: 29.5.0 → 30.2.0
  - jest-axe: 8.0.0 → 10.0.0
  - **対応**: 設定ファイル修正の可能性あり
  - **検証**: 全テストスイート実行

- [ ] **4.4 ESLint周辺の大型更新**
  - eslint-plugin-react-hooks: 5.1.0 → 7.0.0
  - eslint-import-resolver-typescript: 3.7.0 → 4.4.4
  - eslint-plugin-storybook: 0.11.1 → 9.1.10
  - **検証**: lint実行 + 警告・エラー対応

**リスク**: 中
**所要時間**: 8〜12時間
**前提条件**: ステップ3完了

---

### ステップ5: リスク高（大規模変更）

**対象**: アーキテクチャレベルの変更

- [ ] **5.1 Storybook v9への更新**
  - storybook: 7.0.9 → 9.1.10 (+2 major)
  - 全addon更新
  - **破壊的変更**: 設定ファイル構造、Story記法変更
  - **対応**: 既存2ストーリーの書き換え + 設定移行
  - **検証**: Storybookビルド + 全ストーリー表示確認

- [ ] **5.2 markuplint v4への更新**
  - markuplint: 3.7.0 → 4.13.1
  - @markuplint/jsx-parser: 3.6.1 → 4.7.21
  - @markuplint/react-spec: 3.6.1 → 4.5.21
  - **検証**: `yarn lint:html`

- [ ] **5.3 ls-lint更新**
  - @ls-lint/ls-lint: 2.0.0 → 2.3.1
  - **検証**: `yarn lint:ls`

**リスク**: 中〜高
**所要時間**: 4〜6時間
**前提条件**: ステップ4完了

---

### ステップ6: 長期プロジェクト（オプション）

- [ ] **6.1 パッケージマネージャー移行**
  - yarn → pnpm
  - package.json scriptsの調整
  - CI/CD設定変更
  - lockfileの再生成
  - **所要時間**: 2時間

- [ ] **6.2 App Routerへの移行**
  - Pages Router → App Router
  - 段階的移行パターン適用
  - Server Componentsの活用
  - **所要時間**: 20〜40時間（規模による）

- [ ] **6.3 Storybookカバレッジ拡大**
  - 主要コンポーネントのストーリー追加
  - デザインシステム整備
  - ビジュアルリグレッションテスト導入

- [ ] **6.4 テストカバレッジ向上**
  - 単体テスト追加
  - E2Eテストシナリオ拡充

---

## 📋 推奨実施順序

### フェーズ1: 基盤整備（リスクゼロ〜極小）

1. ステップ1（環境整備）
2. ステップ2（devDependencies更新）
3. ステップ3.4（TODOコメント解決）

**期間**: 1週間
**デプロイリスク**: なし

### フェーズ2: 段階的改善（リスク低）

1. ステップ3.1-3.2（dependencies軽微な更新）
2. ステップ3.3フェーズ1（バレルファイル削除開始）

**期間**: 2週間
**デプロイリスク**: 低（十分なテストで緩和）

### フェーズ3: 本格的更新（リスク中）

1. ステップ3.3フェーズ2-3（バレルファイル完全削除）
2. ステップ4.1（Notion API更新）← **最も注意が必要**
3. ステップ4.2-4.5（その他メジャー更新）

**期間**: 3〜4週間
**デプロイリスク**: 中（段階的デプロイ推奨）

### フェーズ4: 大規模更新（リスク高）

1. ステップ5.1（Storybook v9）
2. ステップ5.2-5.3（その他ツール）

**期間**: 1〜2週間
**デプロイリスク**: 中（開発環境のみ影響）

### フェーズ5: 長期改善（オプション）

- ステップ6.1-6.4
- 必要に応じて実施

---

## 🚀 クイックスタート（今すぐできること）

最もリスクが低く、効果的な第一歩:

```bash
# 1. Browserslistの更新
npx update-browserslist-db@latest

# 2. 環境変数の設定
cp .env.example .env
# .envを編集して必要な値を設定

# 3. ビルド確認
yarn build

# 4. oxlintの試用
pnpm add -D oxlint  # 既に追加済み
pnpm oxlint src/
```

**所要時間**: 15分
**リスク**: なし

---

## 📊 成功指標

各ステップ完了時に以下を確認:

- [ ] ビルド成功（`yarn build`）
- [ ] 型チェック通過（`yarn lint:tsc`）
- [ ] Lint通過（`yarn lint:eslint`）
- [ ] ユニットテスト通過（`yarn test`）
- [ ] E2Eテスト通過（`yarn test:e2e`）
- [ ] CI/CD通過
- [ ] プレビュー環境で動作確認（該当する場合）
- [ ] 本番デプロイ成功（該当する場合）

---

## 💡 補足

### Notion API 5.xへの更新について

**主な破壊的変更**:

- クライアント初期化方法の変更
- APIレスポンス型の変更
- ページ・ブロック取得メソッドのシグネチャ変更

**影響範囲**:

- `src/lib/notion/api.ts`（メイン）
- `src/features/post/api/*`

**推奨アプローチ**:

1. 新旧並行で動作させるラッパー層を作成
2. 段階的に移行
3. 十分なE2Eテストで検証

### バレルファイル削除のベストプラクティス

1. 影響範囲の小さいものから
2. 1つずつ削除してコミット
3. 各コミットでビルド確認
4. importパス変更は一括置換ツール活用（VSCodeのRename Symbol等）

### pnpm移行の注意点

- lockfile形式が異なる（yarn.lock → pnpm-lock.yaml）
- phantom dependencies問題の顕在化可能性
- CI/CD設定の変更が必要
- チーム内での統一が必須

---

## 🔗 参考リンク

- [Next.js 15 リリースノート](https://nextjs.org/blog/next-15)
- [Notion API v2 → v5 Migration Guide](https://github.com/makenotion/notion-sdk-js/releases)
- [Storybook 7 → 9 Migration](https://storybook.js.org/docs/migration-guide)
- [React 19 アップグレードガイド](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

**最終更新**: 2025-10-15
**次回レビュー推奨**: フェーズ1完了後
