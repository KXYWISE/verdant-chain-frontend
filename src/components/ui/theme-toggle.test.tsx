import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "./theme-toggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it("matches the stored theme after mount", () => {
    window.localStorage.setItem("va-theme", "dark")
    render(<ThemeToggle />)
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument()
  })

  it("falls back to the system preference when nothing is stored", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      () =>
        ({
          matches: true,
        }) as MediaQueryList
    )
    render(<ThemeToggle />)
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument()
  })

  it("toggles and persists the theme", async () => {
    const user = (await import("@testing-library/user-event")).default
    render(<ThemeToggle />)
    const button = screen.getByRole("button", { name: "Switch to dark theme" })
    await user.click(button)
    expect(window.localStorage.getItem("va-theme")).toBe("dark")
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument()
  })
})
