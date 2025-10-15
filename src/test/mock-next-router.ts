/**
 * SEE: https://github.com/vercel/next.js/discussions/23034#discussioncomment-3493768
 */
import type { NextRouter } from "next/router"
import * as NextRouterModule from "next/router"
import { vi } from "vitest"

// if need requied key, add it.
const defaultNextRouterMock: Partial<NextRouter> = {
  asPath: "/",
}

const useRouter = vi.spyOn(NextRouterModule, "useRouter")

const createMockRouter = (overrides: Partial<NextRouter>) => {
  return {
    ...defaultNextRouterMock,
    ...overrides,
  }
}

export const mockNextRouter = (overrides: Partial<NextRouter> = {}) => {
  const mockRouter = createMockRouter(overrides) as NextRouter
  useRouter.mockReturnValue(mockRouter)
  return mockRouter
}
