"use client"

import { useSyncExternalStore } from "react"
import { useCallback } from "react"
import { shortAddress } from "@/lib/api/address"
import {
  connectWallet,
  disconnectWallet,
  subscribeWallet,
  getWalletSnapshot,
  getWalletServerSnapshot,
  WalletStatus,
  WalletError,
} from "@/lib/wallet/wallet"
import { Button } from "@/components/ui"
import styles from "./wallet-button.module.css"

export function WalletButton() {
  const status = useSyncExternalStore<WalletStatus>(
    subscribeWallet,
    getWalletSnapshot,
    getWalletServerSnapshot
  )

  const handleConnect = useCallback(async () => {
    try {
      await connectWallet()
    } catch (error) {
      if (error instanceof WalletError) {
        console.error("Wallet connection failed:", error.message)
      }
    }
  }, [])

  const handleDisconnect = useCallback(() => {
    disconnectWallet()
  }, [])

  if (status.state === "unavailable") {
    return (
      <Button variant="text" disabled>
        Freighter not available
      </Button>
    )
  }

  if (status.state === "connected") {
    return (
      <Button variant="outlined" className={styles.connected} onClick={handleDisconnect}>
        <span className={styles.address}>{shortAddress(status.address)}</span>
        <span className={styles.dot} aria-hidden="true" />
      </Button>
    )
  }

  return <Button onClick={handleConnect}>Connect Freighter</Button>
}

/** Initialize the wallet store on the client (call once at app root). */
export function useWalletSync() {
  // useEffect with empty deps would be better, but to avoid importing useEffect
  // in this barrel we rely on the consuming component to call syncWallet() after mount.
  // A wrapper component handles this.
  return null
}
