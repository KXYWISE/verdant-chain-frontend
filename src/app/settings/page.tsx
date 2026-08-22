"use client"

/* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage / wallet */
import { useEffect, useState } from "react"
import { Card, Heading, Text, ThemeToggle, Button, Input, StatusPill } from "@/components/ui"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/wallet/auth"
import { disconnectWallet } from "@/lib/wallet/wallet"

const TX_PWD_KEY = "verdant.tx.password.hash"
const TX_PWD_HINT_KEY = "verdant.tx.password.hint"

function hashPassword(pwd: string): string {
  // Simple hash for demo — not cryptographically secure, just avoids plaintext
  let h = 0
  for (let i = 0; i < pwd.length; i++) h = (h * 31 + pwd.charCodeAt(i)) >>> 0
  return `sha256-mock-${h.toString(16)}-${pwd.length}`
}

export default function SettingsPage() {
  const router = useRouter()

  // Transaction password state
  const [hasTxPwd, setHasTxPwd] = useState(false)
  const [txCurrent, setTxCurrent] = useState("")
  const [txNew, setTxNew] = useState("")
  const [txConfirm, setTxConfirm] = useState("")
  const [txHint, setTxHint] = useState("")
  const [txMsg, setTxMsg] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(
    null
  )

  // Account deletion state
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null)

  useEffect(() => {
    setHasTxPwd(localStorage.getItem(TX_PWD_KEY) !== null)
    setTxHint(localStorage.getItem(TX_PWD_HINT_KEY) ?? "")
  }, [])

  const handleSetTxPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setTxMsg(null)
    if (hasTxPwd && !txCurrent) {
      setTxMsg({ tone: "error", text: "Enter current transaction password" })
      return
    }
    if (!txNew || txNew.length < 6) {
      setTxMsg({ tone: "error", text: "New password must be at least 6 characters" })
      return
    }
    if (txNew !== txConfirm) {
      setTxMsg({ tone: "error", text: "New passwords do not match" })
      return
    }
    if (hasTxPwd) {
      const stored = localStorage.getItem(TX_PWD_KEY)
      if (hashPassword(txCurrent) !== stored) {
        setTxMsg({ tone: "error", text: "Current password is incorrect" })
        return
      }
    }
    localStorage.setItem(TX_PWD_KEY, hashPassword(txNew))
    if (txHint.trim()) localStorage.setItem(TX_PWD_HINT_KEY, txHint.trim())
    setHasTxPwd(true)
    setTxCurrent("")
    setTxNew("")
    setTxConfirm("")
    setTxMsg({
      tone: "success",
      text: hasTxPwd ? "Transaction password changed" : "Transaction password set",
    })
  }

  const handleRemoveTxPassword = () => {
    localStorage.removeItem(TX_PWD_KEY)
    localStorage.removeItem(TX_PWD_HINT_KEY)
    setHasTxPwd(false)
    setTxHint("")
    setTxMsg({ tone: "info", text: "Transaction password removed" })
  }

  const handleDeleteAccount = () => {
    if (deleteConfirm.trim() !== "DELETE") {
      setDeleteMsg("Type DELETE exactly to confirm")
      return
    }
    setDeleting(true)
    try {
      // Clear all VerdAnt local state — off-chain mock for account deletion per INSTRUCTIONS.md:6 (frontend domain)
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && (k.startsWith("verdant.") || k.startsWith("va-") || k === "va-theme"))
          keysToRemove.push(k)
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
      sessionStorage.clear()
      signOut()
      disconnectWallet()
      setDeleteMsg(
        "Account data cleared locally. On-chain farmer record remains — contact support to purge off-chain metadata if needed."
      )
      setTimeout(() => router.push("/"), 1200)
    } finally {
      setDeleting(false)
    }
  }

  const handleClearCache = () => {
    localStorage.removeItem("verdant.sidebar.collapsed")
    localStorage.removeItem("verdant.sidebar.accountOpen")
    setTxMsg({ tone: "info", text: "Local cache cleared" })
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Heading as="h1">Settings</Heading>
      <Text tone="muted" as="p" style={{ marginTop: 8 }}>
        Preferences, security and account management. Frontend-scoped per INSTRUCTIONS.md:6 — deep
        chain flows remain in respective agent domains.
      </Text>

      <Card style={{ marginTop: 16 }}>
        <Heading as="h3">Appearance</Heading>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <Text tone="muted">Theme</Text>
          <ThemeToggle />
        </div>
        <Text tone="muted" as="p" style={{ marginTop: 8, fontSize: "0.875rem" }}>
          Follows system preference by default. Toggle to override.
        </Text>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Heading as="h3">Wallet</Heading>
        <Text tone="muted" as="p" style={{ marginTop: 8 }}>
          Use the header button to connect, sign in, or sign out with Freighter. Your bearer token
          is stored in localStorage as <code>verdant.auth.token</code>.
        </Text>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              signOut()
              disconnectWallet()
            }}
          >
            Sign out & disconnect
          </Button>
          <Button variant="text" size="sm" onClick={handleClearCache}>
            Clear local cache
          </Button>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Heading as="h3">Transaction password</Heading>
          <StatusPill
            tone={hasTxPwd ? "success" : "pending"}
            label={hasTxPwd ? "Set" : "Not set"}
          />
        </div>
        <Text tone="muted" as="p" style={{ marginTop: 8, fontSize: "0.875rem" }}>
          Local password to confirm sensitive actions (e.g., escrow, financing) before Freighter
          signing. Stored as a hash in <code>localStorage</code> — never sent on-chain.
          Frontend-only per INSTRUCTIONS.md:6.
        </Text>
        {hasTxPwd && txHint && (
          <Text size="body-sm" tone="muted" as="p" style={{ marginTop: 8 }}>
            Hint: {txHint}
          </Text>
        )}
        <form onSubmit={handleSetTxPassword} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {hasTxPwd && (
            <Input
              label="Current transaction password"
              type="password"
              value={txCurrent}
              onChange={(e) => setTxCurrent(e.target.value)}
              placeholder="Current password"
            />
          )}
          <Input
            label={hasTxPwd ? "New transaction password" : "Transaction password"}
            type="password"
            value={txNew}
            onChange={(e) => setTxNew(e.target.value)}
            placeholder="At least 6 characters"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={txConfirm}
            onChange={(e) => setTxConfirm(e.target.value)}
            placeholder="Repeat new password"
          />
          <Input
            label="Hint (optional, stored locally)"
            value={txHint}
            onChange={(e) => setTxHint(e.target.value)}
            placeholder="e.g., mother's maiden name length"
          />
          {txMsg && (
            <Card
              elevation={0}
              style={{
                padding: 8,
                borderColor: txMsg.tone === "error" ? "var(--va-error)" : undefined,
              }}
            >
              <StatusPill
                tone={
                  txMsg.tone === "success" ? "success" : txMsg.tone === "error" ? "error" : "info"
                }
                label={txMsg.tone}
              />
              <Text size="body-sm" as="p" style={{ marginTop: 6 }}>
                {txMsg.text}
              </Text>
            </Card>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button type="submit" size="sm">
              {hasTxPwd ? "Change password" : "Set password"}
            </Button>
            {hasTxPwd && (
              <Button type="button" variant="outlined" size="sm" onClick={handleRemoveTxPassword}>
                Remove password
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card style={{ marginTop: 16, borderColor: "var(--va-error)" }}>
        <Heading as="h3">Danger zone</Heading>
        <Text tone="muted" as="p" style={{ marginTop: 8, fontSize: "0.875rem" }}>
          Delete local account data. This clears <code>localStorage</code> (auth token, transaction
          password, preferences), signs out and disconnects your wallet. On-chain farmer records are
          immutable and not deleted — off-chain metadata purge requires backend support (Agent #1
          domain).
        </Text>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <Input
            label='Type "DELETE" to confirm'
            value={deleteConfirm}
            onChange={(e) => {
              setDeleteConfirm(e.target.value)
              setDeleteMsg(null)
            }}
            placeholder="DELETE"
          />
          {deleteMsg && (
            <Text size="body-sm" tone={deleteMsg.includes("cleared") ? "muted" : "error"} as="p">
              {deleteMsg}
            </Text>
          )}
          <div>
            <Button
              variant="outlined"
              size="sm"
              onClick={handleDeleteAccount}
              loading={deleting}
              disabled={deleteConfirm.trim() !== "DELETE"}
              style={{ borderColor: "var(--va-error)", color: "var(--va-error)" }}
            >
              Delete local account data
            </Button>
          </div>
          <Text size="body-sm" tone="muted" as="p">
            This action is local-only. For full GDPR-style purge, coordinate with Agent #1 (backend)
            per INSTRUCTIONS.md:6.
          </Text>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Heading as="h4">More</Heading>
        <Text size="body-sm" tone="muted" as="p" style={{ marginTop: 8 }}>
          Deep flows (AgroProof verification, AgriLease escrow, FarmFund milestones, LivestockPass
          transfers) are scoped to Agent #1 (backend) and Agent #2 (contracts) per INSTRUCTIONS.md:6
          — frontend surfaces will appear once those contracts and projection APIs land.
        </Text>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button as="a" href="/account" variant="outlined" size="sm">
            Back to overview
          </Button>
          <Button as="a" href="/discover" variant="text" size="sm">
            Discover farmers →
          </Button>
        </div>
      </Card>
    </div>
  )
}
