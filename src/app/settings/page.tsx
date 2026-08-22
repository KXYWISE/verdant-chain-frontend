"use client"

import { Card, Heading, Text, ThemeToggle } from "@/components/ui"

export default function SettingsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <Heading as="h1">Settings</Heading>
      <Text tone="muted" as="p" style={{ marginTop: 8 }}>
        Preferences for your VerdAnt experience.
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
      </Card>
    </div>
  )
}
