import { describe, expect, test } from "vitest";
import { tcy } from "./tcy";

/**
 * 縦中横 (text-combine-upright) のテスト
 *
 * jlreq §3.1.10 に基づく:
 * - 2桁の数字は縦中横にする（1文字幅に横並びで収まる）
 * - 1桁の数字はそのまま正立（処理不要）
 * - 3桁以上は縦中横にしない（1文字幅に圧縮されて可読性が低下）
 */

const getSpans = (result: ReturnType<typeof tcy>): Array<{ className: string; text: string }> => {
  const spans: Array<{ className: string; text: string }> = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object" && "props" in (node as Record<string, unknown>)) {
      const el = node as { type: string | ((...args: unknown[]) => unknown); props: Record<string, unknown> };
      if (el.type === "span" && el.props.className?.includes("text-combine-upright")) {
        const children = el.props.children;
        spans.push({ className: "tcy", text: String(children) });
      }
      if (el.props.children) walk(el.props.children);
    }
  };
  walk(result);
  return spans;
};

describe("tcy", () => {
  test("2桁の数字を縦中横にする", () => {
    const result = tcy("12月26日にリリース");
    const spans = getSpans(result);
    expect(spans).toEqual([
      { className: "tcy", text: "12" },
      { className: "tcy", text: "26" },
    ]);
  });

  test("1桁の数字はそのまま（処理しない）", () => {
    const result = tcy("第3章を読む");
    const spans = getSpans(result);
    expect(spans).toEqual([]);
  });

  test("3桁以上の数字は縦中横にしない", () => {
    const result = tcy("100個のアイテムと2026年");
    const spans = getSpans(result);
    expect(spans).toEqual([]);
  });

  test("4桁の中から2桁を切り出さない", () => {
    const result = tcy("2026年にリリース");
    const spans = getSpans(result);
    expect(spans).toEqual([]);
  });

  test("数字がない文はそのまま返す", () => {
    const result = tcy("テキストのみ");
    expect(result).toEqual(["テキストのみ"]);
  });

  test("複数の2桁数字を処理する", () => {
    const result = tcy("12時30分に開始");
    const spans = getSpans(result);
    expect(spans).toEqual([
      { className: "tcy", text: "12" },
      { className: "tcy", text: "30" },
    ]);
  });
});
