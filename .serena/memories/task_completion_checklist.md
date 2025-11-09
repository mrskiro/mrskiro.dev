# タスク完了時のチェックリスト

タスクを完了する前に、以下の項目を必ず確認してください。

## 1. Linting実行

```bash
yarn lint
```

このコマンドは以下をすべて並列実行します:
- **oxlint**: TypeScript/JavaScriptの静的解析
- **tsc**: TypeScript型チェック
- **markuplint**: HTML/JSXのlint
- **ls-lint**: ファイル命名規則チェック

### 個別実行が必要な場合

```bash
# oxlint自動修正
yarn lint:oxlint:fix

# 型チェックのみ
yarn lint:tsc

# HTML/JSX lintのみ
yarn lint:html

# ファイル命名規則チェックのみ
yarn lint:ls
```

## 2. ユニットテスト実行

```bash
yarn test
```

- 既存のテストがすべてパスすることを確認
- 新機能追加時は適切なテストを追加

## 3. E2Eテスト実行（必要に応じて）

```bash
yarn test:e2e
```

以下の場合は必ずE2Eテストを実行:
- ユーザーフローに影響する変更
- ルーティングの変更
- 重要な機能の追加・変更

## 4. ビルド確認

```bash
yarn build
```

- ビルドエラーがないことを確認
- 警告も可能な限り解消

## 5. Storybookでの動作確認（UI変更時）

```bash
yarn storybook
```

- コンポーネントの見た目を確認
- 各種propsでの表示を確認
- ダーク/ライトテーマでの表示を確認

## 6. コードレビュー前の最終確認

- [ ] コードスタイルガイドに準拠しているか
  - `type`を使用（`interface`は不可）
  - アロー関数を使用
  - 名前付きエクスポート
  - `any`型を使用していない
  - Tailwind: `gap`を使用（`space-y`は不可）
- [ ] 不要なコメントやconsole.logを削除
- [ ] 適切な型定義を追加
- [ ] エッジケースを考慮
- [ ] エラーハンドリングを実装
- [ ] アクセシビリティを考慮（必要に応じてjest-axe使用）

## 7. Git操作

```bash
# 変更内容確認
git status
git diff

# コミット
git add .
git commit -m "適切なコミットメッセージ"

# プッシュ
git push origin <branch-name>
```

## 8. PR作成

```bash
gh pr create
```

または GitHub UI から作成

## CI/CDの確認

PR作成後、以下のワークフローが成功することを確認:
- **ci.yml**: linting, 型チェック, テスト
- **chromatic.yml**: ビジュアルリグレッションテスト（UI変更時）
- **e2e-on-vercel-preview.yml**: Vercelプレビュー環境でのE2Eテスト

```bash
# CI/CDステータス確認
gh pr checks
```

## 環境変数の確認

新しい環境変数を追加した場合:
- `.env.local.example`を更新（機密情報は含めない）
- README.mdまたはCLAUDE.mdのドキュメントを更新
- Vercelの環境変数設定を更新（本番・プレビュー環境）
