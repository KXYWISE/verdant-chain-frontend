import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  cleanup()
})

const store = new Map<string, string>()

const localStorageMock: Storage = {
  get length() {
    return store.size
  },
  clear() {
    store.clear()
  },
  getItem(key: string) {
    return store.has(key) ? store.get(key)! : null
  },
  key(index: number) {
    return Array.from(store.keys())[index] ?? null
  },
  removeItem(key: string) {
    store.delete(key)
  },
  setItem(key: string, value: string) {
    store.set(key, String(value))
  },
}

if (typeof window !== "undefined" && !window.localStorage) {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  })
}

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
    writable: true,
  })
}
