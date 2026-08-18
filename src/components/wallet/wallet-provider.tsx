"use client"

import { useEffect } from "react"
import { syncWallet } from "@/lib/wallet/wallet"
import { loadAuthToken } from "@/lib/api/client"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loadAuthToken()
    syncWallet()
  }, [])
  return <>{children}</>
}
