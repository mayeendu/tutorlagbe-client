"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

// Hydration is a one-time transition, so there are no store events to track.
const subscribeToHydration = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )
  const isDark = isHydrated && resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-label="Dark mode"
      aria-checked={isDark}
      disabled={!isHydrated || resolvedTheme === undefined}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default"
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-full items-center rounded-full bg-zinc-800 px-1 shadow-sm dark:bg-white"
      >
        <span className="grid size-5 place-items-center rounded-full bg-white text-zinc-900 dark:translate-x-9 dark:bg-zinc-950 dark:text-white">
          <Sun className="size-3.5 dark:hidden" />
          <Moon className="hidden size-3.5 fill-current dark:block" />
        </span>
      </span>
    </button>
  )
}
