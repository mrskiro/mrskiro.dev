"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">エラーが発生しました</h2>
      <button
        onClick={reset}
        className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
      >
        再試行
      </button>
    </div>
  );
}
