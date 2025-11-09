# 推奨コマンド

## 開発

```bash
# 開発サーバー起動
pnpmdev

# 本番ビルド
pnpmbuild

# 本番サーバー起動
pnpmstart
```

## テスト

```bash
# ユニットテスト実行
pnpmtest

# E2Eテスト実行
pnpmtest:e2e

# スナップショット更新
pnpmupdate-snapshots
```

## Linting・型チェック

```bash
# すべてのlinterを並列実行（推奨）
pnpmlint

# oxlint実行
pnpmlint:oxlint

# oxlint自動修正
pnpmlint:oxlint:fix

# TypeScript型チェック
pnpmlint:tsc

# HTML/JSX lint (markuplint)
pnpmlint:html

# ファイル命名規則チェック (ls-lint)
pnpmlint:ls
```

## コンポーネント開発

```bash
# Storybook起動
pnpmstorybook
```

## パッケージ管理

```bash
# 依存関係インストール
pnpminstall

# パッケージ追加
pnpmadd <package-name>

# 開発依存関係追加
pnpmadd -D <package-name>

# パッケージ削除
pnpmremove <package-name>

# 依存関係一覧
pnpmlist
```

## Git操作 (Darwin/macOS)

```bash
# 状態確認
git status

# 変更確認
git diff

# ブランチ一覧
git branch

# ブランチ作成・切り替え
git checkout -b <branch-name>

# コミット
git add .
git commit -m "message"

# プッシュ
git push origin <branch-name>
```

## GitHub CLI (gh)

```bash
# PR作成
gh pr create

# PR一覧
gh pr list

# PR確認
gh pr view

# PR差分
gh pr diff

# CI/CDステータス確認
gh pr checks

# ワークフロー実行一覧
gh run list

# ワークフロー詳細
gh run view
```

## ファイル操作 (Darwin/macOS)

```bash
# ディレクトリ一覧
ls -la

# ツリー表示
tree -L 2

# ファイル検索
find . -name "*.tsx"

# テキスト検索
grep -r "pattern" src/

# ファイル移動・リネーム
mv <source> <destination>
```

## その他

```bash
# ディレクトリ移動
cd <path>

# 現在のパス表示
pwd

# ファイル内容表示
cat <file>
```
