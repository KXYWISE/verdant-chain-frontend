"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSyncExternalStore } from "react"
import { shortAddress } from "@/lib/api/address"
import { Button, Card, StatusPill, Text } from "@/components/ui"
import {
  connectWallet,
  subscribeWallet,
  getWalletSnapshot,
  getWalletServerSnapshot,
  WalletStatus,
  WalletError,
} from "@/lib/wallet/wallet"
import {
  signInWithFreighter,
  signOut,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
  AuthStatus,
} from "@/lib/wallet/auth"
import styles from "./auth-button.module.css"

/**
 * Wallet connect + SEP-40 sign-in control.
 * States:
 * - disconnected -> "Connect Freighter"
 * - connected + signed_out/unknown -> wallet address (click to sign in)
 * - signed_in -> wallet address + sign out
 */
export function AuthButton() {
  const wallet = useSyncExternalStore<WalletStatus>(
    subscribeWallet,
    getWalletSnapshot,
    getWalletServerSnapshot
  )
  const auth = useSyncExternalStore<AuthStatus>(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot
  )
  const [busy, setBusy] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isInsecure, setIsInsecure] = useState(false)

  useEffect(() => {
    // Freighter blocks http even on localhost unless user whitelists it
    if (typeof window !== "undefined" && window.location.protocol === "http:") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time insecure-origin detection
      setIsInsecure(true)
    }
  }, [])

  const handlePrimary = useCallback(async () => {
    if (busy) return
    setBusy(true)
    setAuthError(null)
    try {
      if (wallet.state !== "connected") {
        await connectWallet()
      } else if (auth.state === "signed_out" || auth.state === "unknown") {
        await signInWithFreighter()
      }
    } catch (error) {
      if (error instanceof WalletError) {
        console.error("Wallet authentication failed:", error.message)
        setAuthError(error.message)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, wallet.state, auth.state])

  if (wallet.state === "unavailable") {
    return (
      <Button variant="text" disabled>
        Freighter not available
      </Button>
    )
  }

  if (auth.state === "signed_in") {
    return (
      <Button
        variant="outlined"
        className={styles.signedIn}
        onClick={() => {
          setAuthError(null)
          signOut()
        }}
        title={`Sign out ${auth.address}`}
      >
        <span className={styles.address}>{shortAddress(auth.address)}</span>
        <span className={styles.dot} aria-hidden="true" />
      </Button>
    )
  }

  if (wallet.state === "connected") {
    // Show wallet address instead of generic "Sign in" label — clicking will sign in
    const showInsecureHint = isInsecure
    const isInsecureError = authError !== null && /insecure|ssl|certificate/i.test(authError)
    return (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
          maxWidth: 320,
        }}
      >
        <Button
          variant="outlined"
          className={styles.signedIn}
          onClick={handlePrimary}
          loading={busy}
          title={`Sign in with Freighter as ${wallet.address}`}
        >
          <span className={styles.address}>{shortAddress(wallet.address)}</span>
          <span
            className={styles.dot}
            aria-hidden="true"
            style={{ background: "var(--va-warning, #e6a700)" }}
          />
        </Button>
        {showInsecureHint && !authError && (
          <Text size="body-sm" tone="muted" as="p" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
            Using <code>http://</code> — Freighter blocks sign-in by default. Enable in Freighter →
            Settings → Security → Advanced → “Allow insecure connections”, or run{" "}
            <code>npm run dev:https</code>.
          </Text>
        )}
        {authError && (
          <Card
            elevation={0}
            style={{
              padding: 8,
              borderColor: isInsecureError ? "var(--va-warning, #e6a700)" : undefined,
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <StatusPill
                tone={isInsecureError ? "pending" : "error"}
                label={isInsecureError ? "HTTPS required" : "Sign-in failed"}
              />
            </div>
            <Text
              size="body-sm"
              as="p"
              style={{ marginTop: 6, fontSize: "0.75rem", lineHeight: 1.4 }}
            >
              {authError}
            </Text>
          </Card>
        )}
      </div>
    )
  }

  // disconnected -> Connect Freighter (with optional insecure/auth error hints)
  const showInsecureHint = isInsecure
  const isInsecureError = authError !== null && /insecure|ssl|certificate/i.test(authError)

  const button = (
    <Button onClick={handlePrimary} loading={busy}>
      Connect Freighter
    </Button>
  )

  if (!showInsecureHint && !authError) return button

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        maxWidth: 320,
      }}
    >
      {button}
      {showInsecureHint && !authError && (
        <Text size="body-sm" tone="muted" as="p" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
          Using <code>http://</code> — Freighter blocks sign-in by default. Enable in Freighter →
          Settings → Security → Advanced → “Allow insecure connections”, or run{" "}
          <code>npm run dev:https</code>.
        </Text>
      )}
      {authError && (
        <Card
          elevation={0}
          style={{
            padding: 8,
            borderColor: isInsecureError ? "var(--va-warning, #e6a700)" : undefined,
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <StatusPill
              tone={isInsecureError ? "pending" : "error"}
              label={isInsecureError ? "HTTPS required" : "Sign-in failed"}
            />
          </div>
          <Text
            size="body-sm"
            as="p"
            style={{ marginTop: 6, fontSize: "0.75rem", lineHeight: 1.4 }}
          >
            {authError}
          </Text>
        </Card>
      )}
    </div>
  )
}
