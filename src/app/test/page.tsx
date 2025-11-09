import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page",
  description: "App Router動作確認用のテストページ",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">App Router テストページ</h1>
      <p className="text-lg">
        このページはApp Routerで正しく動作していることを確認するためのテストページです。
      </p>
      <div className="mt-8 flex flex-col gap-2">
        <p>✅ App Routerが正常に動作しています</p>
        <p>✅ ルートレイアウトが適用されています</p>
        <p>✅ ThemeProviderが動作しています</p>
        <p>✅ Tailwind CSSが適用されています</p>
      </div>
      <a
        href="/"
        className="mt-8 rounded-md bg-gray-800 px-6 py-3 text-white hover:bg-gray-700"
      >
        トップページへ戻る (Pages Router)
      </a>
    </div>
  );
}
