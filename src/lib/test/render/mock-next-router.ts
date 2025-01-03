/**
 * SEE: https://github.com/vercel/next.js/discussions/23034#discussioncomment-3493768
 */
import type { NextRouter } from "next/router"

// if need requied key, add it.
const defaultNextRouterMock: Partial<NextRouter> = {
  asPath: "/",
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const useRouter = jest.spyOn(require("next/router"), "useRouter")

const createMockRouter = (overrides: Partial<NextRouter>) => {
  return {
    ...defaultNextRouterMock,
    ...overrides,
  }
}

export const mockNextRouter = (overrides: Partial<NextRouter> = {}) => {
  const mockRouter = createMockRouter(overrides)
  useRouter.mockReturnValue(mockRouter)
  return mockRouter
}
