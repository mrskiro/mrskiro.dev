import { vi } from "vitest";

// Sentryをモック化してテスト環境で無効化
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn(),
  init: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
}));
