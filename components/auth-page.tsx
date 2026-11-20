import { AuthForm } from "@/components/auth-form"

export function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up"

  return (
    <main className="mx-auto grid max-w-6xl items-stretch gap-4 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-2">
      <div className="hidden flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-indigo-800 to-indigo-950 p-9 text-white lg:flex">
        <svg
          aria-hidden="true"
          viewBox="0 0 420 300"
          fill="none"
          className="mx-auto w-full max-w-92"
        >
          <circle cx="210" cy="157" r="120" fill="#4338CA" fillOpacity=".55" />
          <circle
            cx="210"
            cy="157"
            r="142"
            stroke="#A5B4FC"
            strokeOpacity=".35"
            strokeDasharray="5 9"
          />
          <ellipse
            cx="211"
            cy="251"
            rx="128"
            ry="13"
            fill="#1E1B4B"
            fillOpacity=".55"
          />

          <path
            d="M210 171c-34-25-74-32-116-20v74c42-12 82-5 116 20 34-25 74-32 116-20v-74c-42-12-82-5-116 20Z"
            fill="#818CF8"
          />
          <path
            d="M210 160c-35-26-72-32-111-21v73c39-11 76-5 111 21V160Z"
            fill="#F5F3FF"
          />
          <path
            d="M210 160c35-26 72-32 111-21v73c-39-11-76-5-111 21V160Z"
            fill="#C7D2FE"
          />
          <path
            d="M116 158c26-5 52-1 77 12m-77 6c26-5 52-1 77 12m-77 6c26-5 52-1 77 12m34-36c25-13 51-17 77-12m-77 30c25-13 51-17 77-12m-77 30c25-13 51-17 77-12"
            stroke="#818CF8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path d="M173 100v23c19 16 55 16 74 0v-23" fill="#A5B4FC" />
          <path d="m151 93 59-26 59 26-59 26-59-26Z" fill="#E0E7FF" />
          <path
            d="M259 99v24"
            stroke="#FCD34D"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="259" cy="124" r="5" fill="#FCD34D" />

          <path
            d="M102 75v22m-11-11h22m212 21v20m-10-10h20m-41-67v14m-7-7h14"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="128" cy="114" r="4" fill="#C7D2FE" />
          <circle cx="299" cy="89" r="3" fill="#C7D2FE" />
        </svg>
        <div className="mt-4">
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
