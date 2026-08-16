"use client"

import { useEffect } from "react"
import { syncWallet } from "@/lib/wallet/wallet"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    syncWallet()
  }, [])
  return <>{children}</>
}
