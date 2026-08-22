"use client"

import { useCallback, useState } from "react"
import { useSyncExternalStore } from "react"
import { shortAddress } from "@/lib/api/address"
import { Button } from "@/components/ui"
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
 * Wallet connect + SEP-40 sign-in control. Renders the appropriate action for
 * the wallet/auth state and exposes the signed-in identity for sign-out.
 *
 * Design intent:
 * - "Connect Freighter" is always the primary affordance for wallet connection.
 * - After the wallet is connected, the button still shows "Connect Freighter"
 *   so the user can reconnect or reconnect after a session reset.
 * - Sign-in with Freighter is a separate affordance that appears when the
 *   wallet is connected and the user activates the sign-in action.
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

  // Click handler: connects if wallet not connected, otherwise triggers sign-in
  // if wallet is connected but not signed in.
  const handlePrimary = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      if (wallet.state !== "connected") {
        await connectWallet()
      } else if (auth.state === "signed_out" || auth.state === "unknown") {
        await signInWithFreighter()
      }
    } catch (error) {
      if (error instanceof WalletError) {
        console.error("Wallet authentication failed:", error.message)
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
        onClick={() => signOut()}
        title={`Sign out ${auth.address}`}
      >
        <span className={styles.address}>{shortAddress(auth.address)}</span>
        <span className={styles.dot} aria-hidden="true" />
      </Button>
    )
  }

  // Wallet connected (or connecting) but not signed in:
  // always show "Connect Freighter" so the user can re-connect at any time.
  // Sign-in is a separate action triggered from this state.
  return (
    <Button onClick={handlePrimary} loading={busy}>
      Connect Freighter
    </Button>
  )
}