# コードスタイルと規約

## コアプリンシプル

### KISS (Keep It Simple, Stupid)
- シンプルで理解しやすいソリューションを優先
- 過度なエンジニアリングや不要な抽象化を避ける
- コードの可読性と保守性を重視

### YAGNI (You Aren't Gonna Need It)
- 推測による機能追加や将来の対策は行わない
- 現在の要件のみに集中
- コードの肥大化と技術的負債を最小化

## TypeScript規約

### 型定義
- ❌ `interface`は使用禁止
- ✅ `type`を使用
- ❌ `any`型は絶対禁止
- ✅ 適切な型定義または`unknown`を使用

### 関数定義
- ❌ `function`宣言は使用禁止
- ✅ アロー関数を使用

```typescript
// ❌ 悪い例
function greet(name: string) {
  return `Hello, ${name}`;
}

// ✅ 良い例
const greet = (name: string) => {
  return `Hello, ${name}`;
};
```

### エクスポート
- ❌ `export default`は使用禁止（pagesディレクトリを除く）
- ✅ 名前付きエクスポートを使用

### 変数宣言
- 複数回参照される場合のみ変数宣言
- 1回のみの場合はインライン化を推奨（型推論が向上し、スコープが狭まる）

```typescript
// ❌ 不要な変数宣言
const message = `Hello, ${name}`;
return <div>{message}</div>;

// ✅ インライン化
return <div>{`Hello, ${name}`}</div>;
```

### バレルファイル (index.ts/tsx)
- ❌ 再エクスポート用のindex.ts/tsxは使用禁止
- 現状: 41個のバレルファイルが存在（段階的に削除予定）

### ファイル分割
- ユーザーの指示またはフレームワークの制約がない限り、可能な限り単一ファイルに実装を保つ
- 過度なファイル分割を避ける

## React規約

### コンポーネント設計
- コンポーネントはレイアウトコンテキスト（Card、Modal、Sidebarなどの親要素）を知ってはいけない
- 各コンポーネントは自身の責務のみに集中
- 使用される場所を意識しない設計
- 関心の分離、再利用性、テスト容易性、保守性を向上

### 関数型アプローチ
- 関数型プログラミングのパターンを優先
- 副作用を最小化
- 不変性を重視

## Tailwind CSS規約

### スペーシング
- ❌ `space-y-4`などのスペーシングユーティリティは使用禁止
- ✅ flexまたはgridの`gap`を使用

```tsx
// ❌ 悪い例
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ 良い例
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### レイアウトアプローチ
- grid優先のアプローチを推奨
- flexboxも適宜使用

## ファイル命名規則 (.ls-lint.yml)

- **デフォルト**: kebab-case
- **コンポーネント**: kebab-case.tsx
- **Pages**: kebab-case または `[param]` または `_app`

## その他の規約

### Serenaツール使用
- ファイル操作は常にSerenaツールを使用

### context7使用
- ライブラリやツールの調査は常にcontext7を使用

### パッケージマネージャ
- pnpmを使用
