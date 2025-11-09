# 既知の問題とTODO

## 1. バレルファイル（index.ts/tsx）問題

**現状**: 41個のバレルファイルが存在

**問題点**:
- ユーザーのコードスタイルガイド（CLAUDE.md、~/.claude/CLAUDE.md）に違反
- バンドルサイズの増加
- 不要な間接参照によるコード追跡の困難化

**対応**:
- 段階的に削除
- 直接インポートに置き換え
- 新規作成は禁止

**影響範囲**:
- `src/features/post/types/index.ts`
- `src/features/post/utils/index.ts`
- `src/features/post/api/index.ts`
- `src/features/post/components/post-detail/index.ts`
- `src/features/post/components/post-detail/block/*/index.ts` (複数)
- `src/components/*/index.ts` (複数)
- `src/layouts/components/*/index.ts` (複数)
- `src/lib/*/index.ts` (複数)

## 2. パッケージマネージャーの移行完了

**現状**: `pnpm`を使用中

**対応済み**:
- ✅ プロジェクト全体で`pnpm`に移行完了
- ✅ `yarn.lock`を削除し、`pnpm-lock.yaml`を作成
- ✅ CI/CDワークフローも更新完了
- ✅ ドキュメント更新完了

## 3. 古い依存関係

以下の主要な依存関係が古い（roadmap.mdより）:

### @notionhq/client
- **現在**: 2.2.3
- **最新**: 5.2.0
- **更新必要性**: 高（セキュリティ、新機能）

### @sentry/nextjs
- **現在**: 7.50.0
- **最新**: 10.19.0
- **更新必要性**: 高（パフォーマンス、新機能）

### Storybook
- **現在**: 7.0.9
- **最新**: 9.1.10
- **更新必要性**: 中（メジャーバージョンアップ、破壊的変更の可能性）

### その他の依存関係
定期的に`pnpm outdated`で確認

## 4. CLAUDE.mdの情報更新が必要

**Pages Router → App Router移行済み**

CLAUDE.mdには以下の記載があるが、実際はApp Routerに移行済み:
> Next.js 15.0.4 with Pages Router

**対応**:
- CLAUDE.mdを更新して「App Router」に修正
- 関連するアーキテクチャの説明も更新

## 5. テストカバレッジ

**現状**: 一部のコンポーネント・関数のみテストあり

**対応**:
- 重要なビジネスロジックのテストカバレッジを向上
- 特に`features/post/`配下のテストを追加
- E2Eテストの拡充

## 6. アクセシビリティ

**現状**: jest-axeは導入済みだが、全コンポーネントで使用されていない

**対応**:
- 主要コンポーネントにアクセシビリティテストを追加
- ARIA属性の適切な使用を確認
- キーボードナビゲーションのテスト

## 7. パフォーマンス最適化

**検討事項**:
- 画像の最適化（Next.js Image componentの活用）
- コード分割の最適化
- バンドルサイズの削減（バレルファイル削除も含む）
- Lighthouse スコアの改善

## 8. ドキュメント

**不足している項目**:
- API ドキュメント（Notion API連携の詳細）
- コンポーネントのStorybook拡充
- 環境構築手順の詳細化
- トラブルシューティングガイド

## 優先順位

1. **高**: バレルファイル削除（ユーザー設定違反）
2. **高**: CLAUDE.md更新（App Router移行済み）
3. **中**: 依存関係の更新（@notionhq/client, @sentry/nextjs）
4. **低**: テストカバレッジ向上
5. **低**: パフォーマンス最適化
