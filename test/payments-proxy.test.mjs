import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { createServer } from "node:http"
import { setTimeout } from "node:timers/promises"
import { test } from "node:test"

async function listen(server) {
  server.listen(0, "127.0.0.1")
  await once(server, "listening")
  return `http://127.0.0.1:${server.address().port}`
}

async function startFrontend(context, env) {
  const reservation = createServer()
  const origin = await listen(reservation)
  await new Promise((resolve) => reservation.close(resolve))
  const child = spawn(process.execPath, [
    "node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", new URL(origin).port,
  ], { env: { ...process.env, ...env }, stdio: "ignore" })
  context.after(async () => {
    if (child.exitCode !== null || child.signalCode !== null) return
    const exited = once(child, "exit")
    child.kill()
    await exited
  })

  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) break
    const response = await fetch(origin + "/sign-in", { signal: AbortSignal.timeout(1000) }).catch(() => null)
    if (response?.ok) {
      await response.body?.cancel()
      return origin
    }
    await setTimeout(100)
  }
  assert.fail("The built Next.js app did not start. Run npm run build before this test.")
}

test("redirects legacy course listings to the tuition catalog and preserves filters", async (context) => {
  const frontend = await startFrontend(context, { VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" })
  for (const [legacy, destination] of [
    ["/courses", "/tuitions"],
    ["/courses?mode=Online", "/tuitions?mode=Online"],
    ["/courses?mode=Physical", "/tuitions?mode=Offline"],
    ["/courses?mode=Physical&q=Algebra", "/tuitions?q=Algebra&mode=Offline"],
  ]) {
    const response = await fetch(frontend + legacy, { redirect: "manual" })
    assert.equal(response.status, 308)
    const location = new URL(response.headers.get("Location"), frontend)
    const expected = new URL(destination, frontend)
    location.searchParams.sort()
    expected.searchParams.sort()
    assert.equal(location.href, expected.href)
  }
})

test("forwards payment history and checkout to Express and rejects a frontend deployment target", async (context) => {
  const received = []
  const stripeUrl = "https://checkout.stripe.com/c/pay/cs_test_plus_fixture"
  const sessionCookie = "better-auth.session_token=session-fixture"
  const api = createServer(async (request, response) => {
    if (request.url === "/api/auth/token") {
      const hasSession = request.headers.cookie === sessionCookie
      received.push({ method: request.method, path: request.url, hasSession, origin: request.headers.origin })
      response.writeHead(hasSession ? 200 : 401, { "Content-Type": "application/json" })
      response.end(hasSession ? '{"token":"test-fixture"}' : '{"message":"Authentication required"}')
      return
    }
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const body = Buffer.concat(chunks).toString()
    received.push({
      method: request.method, path: request.url,
      authorized: request.headers.authorization === "Bearer test-fixture",
      ...(body ? { body: JSON.parse(body), contentType: request.headers["content-type"] } : {}),
    })
    if (body === '{"plan":"plus"}') {
      const authorized = request.headers.authorization === "Bearer test-fixture"
      response.writeHead(authorized ? 200 : 401, { "Content-Type": "application/json" })
      response.end(JSON.stringify(authorized ? { url: stripeUrl } : { error: "Authentication required" }))
      return
    }
    response.writeHead(request.method === "GET" ? 200 : 503, { "Content-Type": "application/json" })
    response.end(request.method === "GET" ? '{"items":[]}' : '{"code":"BILLING_NOT_CONFIGURED"}')
  })
  const target = await listen(api)
  context.after(() => new Promise((resolve) => api.close(resolve)))
  const frontend = await startFrontend(context, { TUTORLAGBE_API_URL: target, VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" })
  const unauthenticated = await fetch(frontend + "/api/auth/token", { headers: { Origin: frontend } })
  assert.equal(unauthenticated.status, 401)
  const authenticated = await fetch(frontend + "/api/auth/token", { headers: { Cookie: sessionCookie, Origin: frontend } })
  assert.equal(authenticated.status, 200)
  const { token } = await authenticated.json()
  const headers = { Authorization: `Bearer ${token}` }
  const history = await fetch(frontend + "/api/payments/history?page=2", { headers })
  assert.equal(history.status, 200)
  assert.equal(history.headers.get("cache-control"), "no-store")
  assert.deepEqual(await history.json(), { items: [] })

  const checkout = await fetch(frontend + "/api/checkout_session", { method: "POST", headers })
  assert.equal(checkout.status, 503)
  assert.equal((await checkout.json()).code, "BILLING_NOT_CONFIGURED")
  const plusCheckout = await fetch(frontend + "/api/payments/create-checkout-session", {
    method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ plan: "plus" }),
  })
  assert.equal(plusCheckout.status, 200)
  assert.deepEqual(await plusCheckout.json(), { url: stripeUrl })
  assert.deepEqual(received, [
    { method: "GET", path: "/api/auth/token", hasSession: false, origin: frontend },
    { method: "GET", path: "/api/auth/token", hasSession: true, origin: frontend },
    { method: "GET", path: "/api/payments/history?page=2", authorized: true },
    { method: "POST", path: "/api/payments/create-checkout-session", authorized: true },
    { method: "POST", path: "/api/payments/create-checkout-session", authorized: true,
      body: { plan: "plus" }, contentType: "application/json" },
  ])

  const misconfigured = await startFrontend(context, { TUTORLAGBE_API_URL: target, VERCEL_URL: new URL(target).host })
  const refused = await fetch(misconfigured + "/api/payments/history", { headers })
  assert.equal(refused.status, 503)
  assert.equal(received.length, 5)
})

test("production blocks mock fulfillment even with the demo deployment flag", async (context) => {
  const session = "mock_12345678-1234-1234-1234-123456789abc"
  const received = []
  const api = createServer((request, response) => {
    received.push(request.url)
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end('{"mockCheckout":true,"stripeTestCheckout":true,"stripeCheckoutPlans":["plus","pro"]}')
  })
  const origin = await listen(api)
  context.after(() => new Promise((resolve) => api.close(resolve)))
  const frontend = await startFrontend(context, {
    TUTORLAGBE_API_URL: origin, TUTORLAGBE_DEMO_MODE: "true",
    VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "",
  })
  for (const plan of ["plus", "pro"]) {
    const response = await fetch(frontend + "/payment?plan=" + plan)
    assert.equal(response.status, 200)
    const page = await response.text()
    assert.match(page, /Checking your session/)
    assert.doesNotMatch(page, /DEMO PAYMENT - NO REAL CHARGE|checkout-status/)
  }
  for (const path of ["/checkout/mock", "/checkout/mock/result"]) {
    const response = await fetch(frontend + path + "?session=" + session)
    // Next.js can stream a not-found page after committing the status.
    assert.doesNotMatch(await response.text(), /DEMO PAYMENT - NO REAL CHARGE/)
  }
  const path = "/api/payments/mock-checkout/" + session
  assert.equal((await fetch(frontend + path)).status, 404)
  assert.equal((await fetch(frontend + path, { method: "POST", body: '{"action":"pay"}' })).status, 404)
  assert.deepEqual(received, ["/api/payments/config", "/api/payments/config"])
})

test("distinguishes Pro-only releases from Stripe configuration and connection failures", async (context) => {
  let config = { stripeTestCheckout: true, mockCheckout: false }
  const api = createServer((_request, response) => {
    response.writeHead(config ? 200 : 503, { "Content-Type": "application/json" })
    response.end(JSON.stringify(config))
  })
  const origin = await listen(api)
  context.after(() => new Promise((resolve) => api.close(resolve)))
  const frontend = await startFrontend(context, { TUTORLAGBE_API_URL: origin, VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" })
  const render = async (plan) => (await fetch(frontend + "/payment?plan=" + plan)).text()
  assert.match(await render("plus"), /Plus requires a newer version/)
  assert.match(await render("pro"), /Checking your session/)
  config = { stripeTestCheckout: false, mockCheckout: false }
  assert.match(await render("plus"), /Stripe Test Mode is not configured/)
  config = null
  assert.match(await render("plus"), /Could not connect to the checkout service/)
})

test("renders the public tuition catalog when Stripe checkout is unavailable", async (context) => {
  const received = []
  const api = createServer((request, response) => {
    received.push(request.url)
    response.setHeader("Content-Type", "application/json")
    if (request.url === "/api/tuitions/filters") {
      response.end(JSON.stringify({ subjects: ["Math"], classLevels: ["Class 9"] }))
    } else if (request.url === "/api/tuitions?q=Algebra&page=1") {
      response.end(JSON.stringify({
        items: [{
          id: "0123456789abcdef01234567", title: "Algebra for Class 9", subject: "Math",
          classLevel: "Class 9", mode: "Online", location: "Online", monthlyFee: 2000,
          daysPerWeek: 2, description: "Practice algebra.", tutorName: "Sample Tutor", createdAt: "2026-01-01",
        }],
        hasMore: false,
        totalPages: 1,
      }))
    } else {
      response.writeHead(503)
      response.end('{"code":"BILLING_NOT_CONFIGURED"}')
    }
  })
  const target = await listen(api)
  context.after(() => new Promise((resolve) => api.close(resolve)))
  const env = { TUTORLAGBE_API_URL: target, VERCEL: "1", VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" }
  const frontend = await startFrontend(context, env)
  assert.equal((await fetch(frontend + "/api/checkout_session", { method: "POST" })).status, 503)
  const response = await fetch(frontend + "/tuitions?q=Algebra")
  assert.equal(response.status, 200)
  const page = await response.text()
  assert.match(page, /Algebra for Class 9/)
  assert.doesNotMatch(page, /Tuition listings are temporarily unavailable/)
  assert.deepEqual(received.toSorted(), [
    "/api/payments/create-checkout-session", "/api/tuitions/filters", "/api/tuitions?q=Algebra&page=1",
  ])

  const selfTarget = await startFrontend(context, { ...env, VERCEL_URL: new URL(target).host })
  assert.match(await (await fetch(selfTarget + "/tuitions?q=Algebra")).text(), /Tuition listings are temporarily unavailable/)
  assert.equal(received.length, 3)
})
