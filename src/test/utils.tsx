import { render as vitestRender } from "vitest-browser-react"
import { NextRouter } from "next/router"
import { ThemeProvider } from "@/features/theme/context"
import { mockNextRouter } from "./mock-next-router"

type Options = {
  router?: NextRouter
}

export const render = (ui: React.ReactElement, options?: Options) => {
  mockNextRouter(options?.router)
  return vitestRender(<ThemeProvider>{ui}</ThemeProvider>)
}
