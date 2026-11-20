import { Code2 } from "lucide-react"
import Link from "next/link"

import { SiteBrand } from "@/components/site-brand"

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "All courses", href: "/courses" },
      { label: "Testimonials", href: "/#testimonials-title" },
    ],
  },
  {
    title: "How to learn",
    links: [
      { label: "Online courses", href: "/courses?mode=Online" },
      { label: "In-person courses", href: "/courses?mode=Physical" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create an account", href: "/sign-up" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
          <div>
            <SiteBrand />
            <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
              Find one-on-one and small-group tuition online or near you.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-6 sm:grid-cols-3"
          >
            {footerGroups.map(({ title, links }) => (
              <div key={title}>
                <h2 className="font-semibold">{title}</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-block rounded-sm py-1.5 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t py-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tutor Lagbe. All rights reserved.</p>
          <a
            href="https://github.com/mayeendu/tutorlagbe-client"
            className="inline-flex items-center gap-2 rounded-sm py-1.5 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Code2 aria-hidden="true" className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
