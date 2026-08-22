import Link from "next/link"
import { Card, Heading, Text } from "@/components/ui"

export default function AccountPage() {
  return (
    <div style={{ padding: "24px", maxWidth: "720px" }}>
      <Heading as="h1">Account</Heading>
      <Text tone="muted" as="p" style={{ marginTop: 8 }}>
        Manage your VerdAnt account, profile and settings.
      </Text>
      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <Card interactive>
            <Heading as="h3">Profile</Heading>
            <Text tone="muted">
              View and edit your farmer profile, verification markers and on-chain identity.
            </Text>
          </Card>
        </Link>
        <Link href="/settings" style={{ textDecoration: "none" }}>
          <Card interactive>
            <Heading as="h3">Settings</Heading>
            <Text tone="muted">Theme, wallet connection and account preferences.</Text>
          </Card>
        </Link>
      </div>
    </div>
  )
}
