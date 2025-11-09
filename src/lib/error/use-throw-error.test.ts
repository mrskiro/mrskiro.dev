import { renderHook } from "vitest-browser-react";
import { it, expect, vi } from "vitest";
import { useThrowError } from "./use-throw-error";

it("ok", async () => {
  expect.assertions(2);
  vi.spyOn(console, "error").mockImplementation(() => {});

  const { result, act } = await renderHook(() => useThrowError());
  const errorMessage = "something error";
  try {
    await act(() => {
      result.current.throwError(new Error(errorMessage));
    });
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    if (error instanceof Error) {
      expect(error.message).toBe(errorMessage);
    }
  }
});
