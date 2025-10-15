import { it, expect } from "vitest"
import { render } from "@/test/utils"
import { NotFoundPage } from "./not-found"

it("renders correctly", async () => {
  const screen = render(<NotFoundPage />)
  await expect.element(screen.container).toBeInTheDocument()
})
