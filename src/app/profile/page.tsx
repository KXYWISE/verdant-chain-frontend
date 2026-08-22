"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { Card, Heading, Text, Button } from "@/components/ui"
import { getWalletSnapshot, getWalletServerSnapshot, subscribeWallet } from "@/lib/wallet/wallet"

export default function ProfilePage() {
  const wallet = useSyncExternalStore(subscribeWallet, getWalletSnapshot, getWalletServerSnapshot)

  if (wallet.state !== "connected") {
    return (
      <div style={{ padding: 24, maxWidth: 720 }}>
        <Heading as="h1">Profile</Heading>
        <Card style={{ marginTop: 16 }}>
          <Text tone="muted">Connect your Freighter wallet to view your farmer profile.</Text>
          <Text tone="muted" as="p" style={{ marginTop: 8 }}>
            Use the <strong>Connect Freighter</strong> button in the header, then return here — or
            go to <Link href="/discover">Discover</Link> to browse farmers.
          </Text>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Heading as="h1">Profile</Heading>
      <Text tone="muted" as="p" style={{ marginTop: 8 }}>
        Signed in as <code>{wallet.address}</code>
      </Text>
      <Card style={{ marginTop: 16 }}>
        <Heading as="h3">Farmer profile</Heading>
        <Text tone="muted" as="p" style={{ marginTop: 8 }}>
          View your full on-chain farmer record:
        </Text>
        <div style={{ marginTop: 12 }}>
          <Button as="a" href={`/farmers/${wallet.address}`}>
            Open farmer profile
          </Button>
        </div>
      </Card>
    </div>
  )
}
