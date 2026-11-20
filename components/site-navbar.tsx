"use client"

import { Popover } from "@base-ui/react/popover"
import { ChevronDown, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const links = [
  { href: "/courses", label: "Our courses" },
  { href: "/teachers", label: "Our teachers" },
  { href: "/learning-materials", label: "Learning materials" },
]

const menuLinkClass =
  "block rounded-lg px-3 py-2.5 font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"

function AuthLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/sign-in" onNavigate={onNavigate} />}
        className="h-11 px-5"
      >
        Sign in
      </Button>
      <Button
        nativeButton={false}
        render={<Link href="/sign-up" onNavigate={onNavigate} />}
        className="h-11 bg-indigo-700 px-5 text-white hover:bg-indigo-800"
      >
        Sign up
      </Button>
    </>
  )
}

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-400 grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:px-7 lg:min-h-22 lg:grid-cols-[1fr_auto_1fr] xl:px-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span
            aria-hidden="true"
            className="relative size-10 rounded-xl bg-indigo-700"
          >
            <span className="absolute top-3.5 left-2 h-3.5 w-2.5 skew-y-14 rounded-xs bg-white" />
            <span className="absolute top-3.5 right-2 h-3.5 w-2.5 -skew-y-14 rounded-xs bg-white" />
            <span className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-amber-300" />
          </span>
          <span className="text-2xl font-bold tracking-tight">Tutor Lagbe</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex xl:gap-4"
        >
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={menuLinkClass}>
              {label}
            </Link>
          ))}
          <Popover.Root>
            <Popover.Trigger
              render={<Button variant="ghost" />}
              className="group h-11 gap-2 px-3 text-base"
            >
              Pages
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform group-data-popup-open:rotate-180"
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner
                sideOffset={8}
                align="start"
                className="z-50 hidden lg:block"
              >
                <Popover.Popup
                  aria-label="Pages"
                  className="w-40 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg"
                >
                  <Popover.Close
                    nativeButton={false}
                    render={<Link href="/" />}
                    className={menuLinkClass}
                  >
                    Home
                  </Popover.Close>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </nav>

        <div className="hidden items-center gap-2 justify-self-end lg:flex">
          <AuthLinks />
        </div>

        <div className="lg:hidden">
          <Popover.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Popover.Trigger
              aria-label="Navigation menu"
              render={<Button variant="outline" />}
              className="size-11"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner
                align="end"
                sideOffset={12}
                collisionPadding={16}
                className="z-50 lg:hidden"
              >
                <Popover.Popup
                  aria-label="Navigation menu"
                  className="w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
                >
                  <nav aria-label="Main navigation">
                    {links.map(({ href, label }) => (
                      <Popover.Close
                        key={href}
                        nativeButton={false}
                        render={<Link href={href} />}
                        className={menuLinkClass}
                      >
                        {label}
                      </Popover.Close>
                    ))}
                    <details className="group">
                      <summary
                        className={`${menuLinkClass} flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden`}
                      >
                        Pages
                        <ChevronDown
                          aria-hidden="true"
                          className="size-4 transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <Popover.Close
                        nativeButton={false}
                        render={<Link href="/" />}
                        className={`ml-3 ${menuLinkClass}`}
                      >
                        Home
                      </Popover.Close>
                    </details>
                  </nav>
                  <div className="mt-2 grid grid-cols-2 gap-2 border-t p-2 pt-3">
                    <AuthLinks onNavigate={() => setMobileOpen(false)} />
                  </div>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </header>
  )
}
