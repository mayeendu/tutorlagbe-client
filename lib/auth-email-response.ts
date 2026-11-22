const authErrors = new Map([
  ["INVALID_EMAIL_OR_PASSWORD", "Invalid email or password."],
  ["EMAIL_NOT_VERIFIED", "Verify your email address before signing in."],
  ["INVALID_ORIGIN", "This address is not authorized for authentication. Open the main TutorLagbe site and try again."],
  ["MISSING_OR_NULL_ORIGIN", "The request origin could not be verified. Open TutorLagbe directly and try again."],
  ["CROSS_SITE_NAVIGATION_LOGIN_BLOCKED", "Open TutorLagbe directly to sign in."],
])

export async function safeEmailAuthResponse(
  response: Response,
  action: "sign-in" | "sign-up",
  source: "express" | "legacy"
) {
  const isJson = response.headers.get("content-type")?.includes("application/json")
  if (response.ok && isJson || response.status >= 300 && response.status < 400) return response

  const status = response.ok ? 502 : response.status
  const body: { code?: unknown } | null = isJson ? await response.json().catch(() => null) : null
  if (!isJson) await response.body?.cancel()
  const authCode = typeof body?.code === "string" ? body.code : ""
  const knownMessage = authErrors.get(authCode)
  const [code, message] = knownMessage ? [authCode, knownMessage]
    : status === 429 ? ["AUTH_RATE_LIMIT", "Too many attempts. Wait a moment and try again."]
      : response.ok || !isJson ? ["AUTH_UNEXPECTED_RESPONSE", "The authentication service returned an unexpected response. Try again shortly."]
        : status >= 500 ? ["AUTH_UNAVAILABLE", "The authentication service is temporarily unavailable. Try again shortly."]
          : ["AUTH_REQUEST_FAILED", "Authentication could not be completed. Check your details and try again."]

  console.warn("[Auth] Email request failed.", { action, status, code, source })
  const headers = new Headers(response.headers)
  headers.delete("content-length")
  headers.delete("content-encoding")
  headers.set("Cache-Control", "no-store")
  headers.set("Content-Type", "application/json")
  return Response.json({ code, message }, { status, headers })
}
