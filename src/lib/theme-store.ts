export type Theme = "light" | "dark"

export const THEME_KEY = "va-theme"

const listeners = new Set<() => void>()

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === "light" || stored === "dark" ? stored : null
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function getTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(THEME_KEY, theme)
  listeners.forEach((listener) => listener())
}
