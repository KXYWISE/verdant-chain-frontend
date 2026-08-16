import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Container } from "./container"

describe("Container", () => {
  it("renders children and applies the fluid class by default", () => {
    const { container } = render(
      <Container>
        <span>content</span>
      </Container>
    )
    expect(screen.getByText("content")).toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass("fluid")
  })

  it("supports a fixed size", () => {
    const { container } = render(<Container fluid={false} size="md" />)
    expect(container.firstElementChild).toHaveClass("sizeMd")
  })

  it("adds the containment class when container is enabled", () => {
    const { container } = render(<Container container />)
    expect(container.firstElementChild).toHaveClass("context")
  })

  it("renders as a custom element", () => {
    const { container } = render(<Container as="section" aria-label="frame" />)
    expect(container.firstElementChild?.tagName).toBe("SECTION")
  })
})
