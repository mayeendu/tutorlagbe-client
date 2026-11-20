import type { Metadata } from "next"

import { AuthPage } from "@/components/auth-page"

export const metadata: Metadata = { title: "Sign up | Tutor Lagbe" }

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />
}
