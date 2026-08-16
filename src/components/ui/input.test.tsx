import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("associates the label with the input", () => {
    render(<Input label="Field name" />)
    expect(screen.getByLabelText("Field name")).toBeInTheDocument()
  })

  it("shows an error message and marks the input invalid", async () => {
    render(<Input label="Amount" error="Required" />)
    expect(screen.getByRole("alert")).toHaveTextContent("Required")
    expect(screen.getByLabelText("Amount")).toHaveAttribute("aria-invalid", "true")
  })

  it("exposes the value on change", async () => {
    const user = userEvent.setup()
    render(<Input label="Name" />)
    const field = screen.getByLabelText("Name")
    await user.type(field, "Ana")
    expect(field).toHaveValue("Ana")
  })
})
