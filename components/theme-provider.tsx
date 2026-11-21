"use client"

import * as React from "react"

type Theme = "light" | "dark"

const storageKey = "theme"
const mediaQuery = "(prefers-color-scheme: dark)"
const themeChange = "tutorlagbe:theme-change"
let currentPreference: Theme | undefined

function getResolvedTheme(): Theme {
  let preference: string | null | undefined = currentPreference
  if (!preference) {
    try {
      preference = localStorage.getItem(storageKey)
    } catch {
      // The system preference still works when storage is unavailable.
    }
  }

  if (preference === "light" || preference === "dark") {
    return preference
  }

  return window.matchMedia(mediaQuery).matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (root.classList.contains(theme) && root.style.colorScheme === theme) {
    return
  }

  const style = document.createElement("style")
  style.textContent = "*, *::before, *::after { transition: none !important; }"
  document.head.appendChild(style)
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
  window.getComputedStyle(document.body).getPropertyValue("color")
  window.setTimeout(() => style.remove(), 0)
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(mediaQuery)
  function update() {
    applyTheme(getResolvedTheme())
    onChange()
  }

  function onStorage(event: StorageEvent) {
    if (event.storageArea === localStorage && (event.key === storageKey || event.key === null)) {
      currentPreference = undefined
      update()
    }
  }

  media.addEventListener("change", update)
  window.addEventListener("storage", onStorage)
  window.addEventListener(themeChange, update)
  update()

  return () => {
    media.removeEventListener("change", update)
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(themeChange, update)
  }
}

function setTheme(theme: Theme) {
  currentPreference = theme
  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    // Keep the selected theme for the current page.
  }
  window.dispatchEvent(new Event(themeChange))
}

const ThemeContext = React.createContext<{
  resolvedTheme: Theme | undefined
  setTheme: typeof setTheme
}>({ resolvedTheme: undefined, setTheme })

function useTheme() {
  return React.useContext(ThemeContext)
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = React.useSyncExternalStore(subscribe, getResolvedTheme, () => undefined)

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key !== "d" && event.key !== "D") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider, useTheme }
