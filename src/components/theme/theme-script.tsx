"use client"

import { THEME_KEY } from "@/lib/theme-store"

const THEME_SCRIPT = `(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    if (t === "dark" || t === "light") {
      document.documentElement.dataset.theme = t;
    }
  } catch (e) {}
})();`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
