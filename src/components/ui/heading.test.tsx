import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Heading } from "./heading"

describe("Heading", () => {
  it("renders the correct element and level class", () => {
    const { container } = render(<Heading as="h1">VerdAnt</Heading>)
    expect(container.querySelector("h1")).toBeInTheDocument()
    expect(container.querySelector("h1")).toHaveClass("h1")
  })

  it("defaults to h2 when no level is given", () => {
    const { container } = render(<Heading>Section</Heading>)
    expect(container.querySelector("h2")).toBeInTheDocument()
  })
})
