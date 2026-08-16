import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Book equipment</Button>)
    expect(screen.getByRole("button", { name: "Book equipment" })).toBeInTheDocument()
  })

  it("applies the filled variant by default", () => {
    const { container } = render(<Button>Book</Button>)
    expect(container.querySelector("button")).toHaveClass("filled")
  })

  it("disables and shows a busy state while loading", () => {
    render(
      <Button loading aria-label="Submit">
        Submit
      </Button>
    )
    const button = screen.getByRole("button", { name: "Submit" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("honours the disabled prop", () => {
    render(<Button disabled>Done</Button>)
    expect(screen.getByRole("button", { name: "Done" })).toBeDisabled()
  })

  it("adds the block class for full-width layout", () => {
    const { container } = render(<Button block>Wide</Button>)
    expect(container.querySelector("button")).toHaveClass("block")
  })
})
