import { House } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function PageFallback({ title, message }: { title: string; message: string }) {
  return (
    <main className="mx-auto grid min-h-[55vh] max-w-2xl place-items-center px-5 py-14 sm:px-8">
      <section aria-labelledby="fallback-title" className="w-full rounded-3xl border bg-card p-6 text-center text-card-foreground shadow-sm sm:p-12">
        <h1 id="fallback-title" className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">{message}</p>
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          className="mt-6 h-11 bg-indigo-700 px-4 text-white hover:bg-indigo-800"
        >
          <House aria-hidden="true" />
          Back to Home
        </Button>
      </section>
    </main>
  )
}
