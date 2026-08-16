"use client"

const THEME_SCRIPT = `(function () {
  try {
    var t = localStorage.getItem("va-theme");
    if (t === "dark" || t === "light") {
      document.documentElement.dataset.theme = t;
    }
  } catch (e) {}
})();`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
