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

test("forwards payment history and checkout to Express and rejects a frontend deployment target", async (context) => {
  const received = []
  const api = createServer((request, response) => {
    received.push({ method: request.method, path: request.url, authorized: request.headers.authorization === "Bearer test-fixture" })
    response.writeHead(request.method === "GET" ? 200 : 503, { "Content-Type": "application/json" })
    response.end(request.method === "GET" ? '{"items":[]}' : '{"code":"BILLING_NOT_CONFIGURED"}')
  })
  const target = await listen(api)
  context.after(() => new Promise((resolve) => api.close(resolve)))
  const frontend = await startFrontend(context, { TUTORLAGBE_API_URL: target, VERCEL_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" })
  const headers = { Authorization: "Bearer test-fixture" }
  const history = await fetch(frontend + "/api/payments/history?page=2", { headers })
  assert.equal(history.status, 200)
  assert.equal(history.headers.get("cache-control"), "no-store")
  assert.deepEqual(await history.json(), { items: [] })

  const checkout = await fetch(frontend + "/api/checkout_session", { method: "POST", headers })
  assert.equal(checkout.status, 503)
  assert.equal((await checkout.json()).code, "BILLING_NOT_CONFIGURED")
  assert.deepEqual(received, [
    { method: "GET", path: "/api/payments/history?page=2", authorized: true },
    { method: "POST", path: "/api/payments/create-checkout-session", authorized: true },
  ])

  const misconfigured = await startFrontend(context, { TUTORLAGBE_API_URL: target, VERCEL_URL: new URL(target).host })
  const refused = await fetch(misconfigured + "/api/payments/history", { headers })
  assert.equal(refused.status, 503)
  assert.equal(received.length, 2)
})
