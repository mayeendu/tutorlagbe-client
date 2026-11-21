import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:font-semibold focus:outline-2 focus:outline-ring"
          >
            Skip to content
          </a>
          <SiteNavbar />
          <div id="main-content" tabIndex={-1} className="min-w-0 flex-1">
            {children}
          </div>
          <SiteFooter />
          <Toaster id="tuition" position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
