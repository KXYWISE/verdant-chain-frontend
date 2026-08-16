import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Stack } from "./stack"

describe("Stack", () => {
  it("renders children vertically by default", () => {
    const { container } = render(
      <Stack>
        <span>one</span>
        <span>two</span>
      </Stack>
    )
    expect(screen.getByText("one")).toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass("root")
  })

  it("applies the responsive class when enabled", () => {
    const { container } = render(<Stack responsive />)
    expect(container.firstElementChild).toHaveClass("responsive")
  })

  it("maps gap to the matching token class", () => {
    const { container } = render(<Stack gap={8} />)
    expect(container.firstElementChild).toHaveClass("gap8")
  })

  it("supports wrapping", () => {
    const { container } = render(<Stack wrap />)
    expect(container.firstElementChild).toHaveClass("wrap")
  })
})
