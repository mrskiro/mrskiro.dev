import { render } from "vitest-browser-react";
import { it, expect, vi } from "vitest";
import { useThrowError } from "@/lib/error/use-throw-error";
import { ErrorBoundary } from "./error-boundary";

it("ok", async () => {
  const screen = await render(
    <ErrorBoundary fallback={() => <p>error</p>}>
      <h1>children</h1>
    </ErrorBoundary>,
  );
  await expect.element(screen.getByText("children")).toBeInTheDocument();
  expect(screen.container).toMatchSnapshot();
});

it("should display fallback when throw error in children", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const Component = () => {
    throw new Error("something error");
  };
  const screen = await render(
    <ErrorBoundary fallback={() => <p>error</p>}>
      <Component />
    </ErrorBoundary>,
  );
  await expect.element(screen.getByText("error")).toBeInTheDocument();
  expect(screen.container).toMatchSnapshot();
});

it("should display fallback when throw error in event handler", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const Component = () => {
    const { throwError } = useThrowError();
    return (
      <button
        type="button"
        onClick={() => {
          throwError(new Error("something event error"));
        }}
      >
        click me
      </button>
    );
  };
  const screen = await render(
    <ErrorBoundary fallback={() => <p>error</p>}>
      <Component />
    </ErrorBoundary>,
  );
  const btn = screen.getByRole("button");
  await btn.click();
  await expect.element(screen.getByText("error")).toBeInTheDocument();
  await expect.element(btn).not.toBeInTheDocument();
});

it("should call onError prop", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const onError = vi.fn();
  const ThrowError = () => {
    throw new Error("something error");
  };
  await render(
    <ErrorBoundary fallback={() => <p>error</p>} onError={onError}>
      <ThrowError />
    </ErrorBoundary>,
  );
  expect(onError).toHaveBeenCalled();
  expect(onError).toHaveBeenCalledWith(new Error("something error"));
});
