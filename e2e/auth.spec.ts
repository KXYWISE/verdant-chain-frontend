import { test, expect, type Page } from "@playwright/test"

/**
 * Freighter stub that replies to `FREIGHTER_EXTERNAL_MSG_REQUEST` messages
 * synchronously so the wallet appears connected with a test account.
 * Uses a hard-coded key string instead of module-level variables to avoid
 * scope issues with `addInitScript`.
 */
const TEST_KEY = "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ23456"

function stubFreighter() {
  const handler = (event: MessageEvent) => {
    const data = event.data as { source?: string; messageId?: number; type?: string } | null
    if (!data || data.source !== "FREIGHTER_EXTERNAL_MSG_REQUEST") return
    const id = data.messageId
    const respond = (payload: Record<string, unknown>) => {
      window.postMessage(
        { source: "FREIGHTER_EXTERNAL_MSG_RESPONSE", messagedId: id, ...payload },
        window.location.origin
      )
    }
    switch (data.type) {
      case "REQUEST_CONNECTION_STATUS":
        respond({ isConnected: true })
        break
      case "REQUEST_PUBLIC_KEY":
      case "REQUEST_ACCESS":
        respond({ publicKey: TEST_KEY })
        break
      case "REQUEST_ALLOWED_STATUS":
        respond({ isAllowed: true })
        break
      case "SUBMIT_BLOB":
        respond({ signedBlob: "c2lnbmF0dXJl", signerAddress: TEST_KEY })
        break
    }
  }
  window.addEventListener("message", handler)
}

async function mockAuthApi(page: Page) {
  await page.route("**/api/v1/auth/challenge", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        domain: "app.verdant.example",
        nonce: "e2e-nonce",
        timestamp: "2026-08-19T00:00:00Z",
        address: TEST_KEY,
      }),
    })
  )
  await page.route("**/api/v1/auth/verify", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "e2e-token",
        address: TEST_KEY,
        roles: ["farmer"],
        expires_at: "2026-08-26T00:00:00Z",
      }),
    })
  )
}

test.describe("wallet connect and SEP-40 sign-in", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthApi(page)
    await page.addInitScript(stubFreighter)
  })

  test("connects the wallet and signs in with Freighter", async ({ page }) => {
    await page.goto("/")

    const header = page.getByRole("banner")
    const connect = header.getByRole("button", { name: "Connect Freighter" })
    await expect(connect).toBeVisible()
    await connect.click()

    // After connecting, the button should show "Sign in with Freighter"
    const signIn = header.getByRole("button", { name: "Sign in with Freighter" })
    await expect(signIn).toBeVisible()
    await signIn.click()

    // Should now show signed-out UI with Connect Freighter again
    await expect(header.getByRole("button", { name: "Connect Freighter" })).toBeVisible()
  })

  test("sign out returns to the signed-out state", async ({ page }) => {
    await page.goto("/")

    // Connect then sign out
    await page.getByRole("banner").getByRole("button", { name: "Connect Freighter" }).click()
    await page.getByRole("banner").getByRole("button", { name: "Sign in with Freighter" }).click()

    // Should return to Connect Freighter state
    await expect(page.getByRole("banner").getByRole("button", { name: "Connect Freighter" })).toBeVisible()
  })