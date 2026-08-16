import { getAddress, isConnected, requestAccess } from "@stellar/freighter-api"

export type WalletStatus =
  { state: "unavailable" } | { state: "disconnected" } | { state: "connected"; address: string }

export class WalletError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "WalletError"
    this.code = code
  }
}

let status: WalletStatus = { state: "disconnected" }
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeWallet(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getWalletSnapshot(): WalletStatus {
  return status
}

function setStatus(next: WalletStatus) {
  status = next
  emit()
}

/** Sync the store with Freighter's persisted connection (safe on the server). */
export async function syncWallet(): Promise<void> {
  if (typeof window === "undefined") return
  try {
    const res = await isConnected()
    if (res.error || !res.isConnected) {
      setStatus({ state: "disconnected" })
      return
    }
    const addr = await getAddress()
    if (addr.error || !addr.address) {
      setStatus({ state: "disconnected" })
      return
    }
    setStatus({ state: "connected", address: addr.address })
  } catch {
    setStatus({ state: "disconnected" })
  }
}

/** Request wallet access; throws WalletError if the wallet is unavailable or denied. */
export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined") {
    throw new WalletError("ssr", "Wallet access requires a browser")
  }
  try {
    const res = await requestAccess()
    if (res.error) throw new WalletError(res.error.code, res.error.message)
    setStatus({ state: "connected", address: res.address })
    return res.address
  } catch (error) {
    setStatus({ state: "unavailable" })
    if (error instanceof WalletError) throw error
    throw new WalletError("unavailable", "Freighter is not available in this browser")
  }
}

export function disconnectWallet(): void {
  setStatus({ state: "disconnected" })
}
