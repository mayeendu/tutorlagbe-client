"use client"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Toaster, toast } from "sonner"

import { Button } from "@/components/ui/button"
import { signIn, signUp } from "@/lib/auth-client"
import {
  minimumPasswordLength,
  signInSchema,
  signUpSchema,
} from "@/lib/auth-validation"

const inputClass =
  "h-12 w-full rounded-lg border bg-background px-3 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isSignUp = mode === "sign-up"

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const values = Object.fromEntries(new FormData(event.currentTarget))
    const registration = isSignUp ? signUpSchema.safeParse(values) : undefined
    const validation = registration ?? signInSchema.safeParse(values)

    if (!validation.success) {
      const fieldErrors = Object.fromEntries(
        validation.error.issues.map((issue) => [
          String(issue.path[0]),
          issue.message,
        ])
      )
      setErrors(fieldErrors)
      event.currentTarget
        .querySelector<HTMLElement>(
          `[name="${String(validation.error.issues[0].path[0])}"]`
        )
        ?.focus()
      return
    }

    setErrors({})
    setPending(true)
    try {
      const result =
        registration?.success
          ? await signUp.email(registration.data)
          : await signIn.email({
              email: validation.data.email,
              password: validation.data.password,
            })

      if (result.error) {
        toast.error(
          result.error.status && result.error.status < 500
            ? result.error.message || "Check your details and try again."
            : "We couldn’t connect to your account. Try again shortly."
        )
        return
      }

      router.replace("/")
      router.refresh()
    } catch {
      toast.error("We couldn’t connect to your account. Try again shortly.")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <form
        method="post"
        onSubmit={submit}
        noValidate
        className="mt-7 space-y-4"
        aria-busy={pending}
      >
        {isSignUp && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              className={inputClass}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className={`${inputClass} pr-12`}
              required
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : isSignUp
                    ? "password-hint"
                    : undefined
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-1 my-auto size-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </Button>
          </div>
          {errors.password ? (
            <p id="password-error" className="text-sm text-destructive">
              {errors.password}
            </p>
          ) : (
            isSignUp && (
              <p id="password-hint" className="text-sm text-muted-foreground">
                Use at least {minimumPasswordLength} characters.
              </p>
            )
          )}
        </div>
        {isSignUp && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">I want to</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium has-checked:border-indigo-500 has-checked:bg-indigo-500/10">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  defaultChecked
                  className="accent-indigo-700"
                />{" "}
                Student
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium has-checked:border-indigo-500 has-checked:bg-indigo-500/10">
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  className="accent-indigo-700"
                />{" "}
                Tutor
              </label>
            </div>
          </fieldset>
        )}
        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 w-full bg-indigo-700 text-base text-white hover:bg-indigo-800"
        >
          {pending
            ? isSignUp
              ? "Creating account…"
              : "Signing in…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have an account?" : "New to Tutor Lagbe?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </>
  )
}
