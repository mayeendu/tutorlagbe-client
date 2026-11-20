import Image from "next/image"

import { AuthForm } from "@/components/auth-form"

export function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up"

  return (
    <main className="mx-auto grid max-w-6xl items-stretch gap-4 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-3xl bg-indigo-950 lg:block">
        <Image
          src="/tutoring-hero.webp"
          alt=""
          fill
          sizes="540px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/75 to-transparent px-8 pt-24 pb-9 text-white">
          <p className="max-w-xs text-3xl font-semibold tracking-tight">
            {isSignUp
              ? "Make room to learn or teach."
              : "Pick up where you left off."}
          </p>
        </div>
      </div>
      <section
        aria-labelledby="auth-title"
        className="mx-auto w-full max-w-xl rounded-3xl border bg-card px-5 py-8 shadow-sm sm:px-10 lg:max-w-none lg:px-12"
      >
        <div className="mx-auto max-w-sm">
          <h1
            id="auth-title"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSignUp
              ? "Join Tutor Lagbe as a student or tutor."
              : "Sign in to your Tutor Lagbe account."}
          </p>
          <AuthForm mode={mode} />
        </div>
      </section>
    </main>
  )
}
