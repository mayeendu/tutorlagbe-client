import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"
import { notifyError, notifySuccess } from "@/lib/notify"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
  fetchOptions: {
    onSuccess({ request }) {
      const path = String(request.url)
      if (path.endsWith("/sign-up/email")) notifySuccess("Account created.")
      if (path.endsWith("/sign-in/email")) notifySuccess("Signed in.")
      if (path.endsWith("/sign-out")) notifySuccess("Signed out.")
    },
    onError({ request }) {
      if (String(request.url).endsWith("/sign-out")) notifyError(undefined, "Could not sign out. Please try again.")
    },
  },
})

export const { signIn, signUp, useSession } = authClient
