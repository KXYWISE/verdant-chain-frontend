import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StatusPill } from "./status-pill"

describe("StatusPill", () => {
  it("renders the label", () => {
    render(<StatusPill label="Verified" />)
    expect(screen.getByText("Verified")).toBeInTheDocument()
  })

  it("shows a status dot by default", () => {
    const { container } = render(<StatusPill label="Pending" tone="pending" />)
    expect(container.querySelector(".dot")).toBeInTheDocument()
  })

  it("can hide the dot", () => {
    const { container } = render(<StatusPill label="Info" dot={false} />)
    expect(container.querySelector(".dot")).not.toBeInTheDocument()
  })
})
