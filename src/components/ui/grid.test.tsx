import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Grid } from "./grid"

describe("Grid", () => {
  it("renders items in a grid", () => {
    render(
      <Grid>
        <span>a</span>
        <span>b</span>
      </Grid>
    )
    expect(screen.getByText("a")).toBeInTheDocument()
  })

  it("applies the base column class", () => {
    const { container } = render(<Grid cols={3} />)
    expect(container.firstElementChild).toHaveClass("cols3")
  })

  it("is responsive by default", () => {
    const { container } = render(<Grid />)
    expect(container.firstElementChild).toHaveClass("responsive")
  })

  it("can disable responsive growth", () => {
    const { container } = render(<Grid responsive={false} />)
    expect(container.firstElementChild).not.toHaveClass("responsive")
  })
})
