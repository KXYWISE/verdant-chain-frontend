import Link from "next/link"
import { Button, Card, Heading, StatusPill, Text, ThemeToggle, WalletButton } from "@/components/ui"
import styles from "./home.module.css"

const pillars = [
  { name: "AgriScout", blurb: "Farmer discovery, profiles, and agricultural reputation." },
  { name: "AgroProof", blurb: "Verification along the harvest-to-buyer chain." },
  { name: "AgriLease", blurb: "Equipment marketplace with escrowed bookings." },
  { name: "FarmFund", blurb: "Milestone-based agricultural financing." },
  { name: "LivestockPass", blurb: "Identity and history for livestock." },
]

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>
          <span className={styles.logo}>V</span>
          <strong>VerdAnt</strong>
        </span>
        <nav className={styles.nav}>
          <Link href="/design-system">Design system</Link>
          <Link href="/discover">AgriScout</Link>
          <WalletButton />
        </nav>
      </div>

      <section className={styles.hero}>
        <StatusPill tone="success" label="Built on Stellar" />
        <Heading as="h1" size={1}>
          Agricultural infrastructure for a resilient food web.
        </Heading>
        <Text size="body-lg" tone="muted" as="p" className={styles.lede}>
          VerdAnt is open-source technology and financial infrastructure for farmers — identity,
          verification, leasing, and financing — anchored by Soroban smart contracts.
        </Text>
        <div className={styles.actions}>
          <Button as="a" href="/design-system">
            Explore the design system
          </Button>
          <Button as="a" variant="outlined" href="/discover">
            Try AgriScout
          </Button>
        </div>
      </section>

      <section className={styles.pillars} aria-label="Feature pillars">
        {pillars.map((pillar) => (
          <Card key={pillar.name} interactive className={styles.pillarCard}>
            <Heading as="h3">{pillar.name}</Heading>
            <Text as="p" tone="muted">
              {pillar.blurb}
            </Text>
          </Card>
        ))}
      </section>

      <footer className={styles.footer}>
        <Text as="p" size="body-sm" tone="muted">
          Foundation preview — the design system and shell. Feature surfaces arrive after API
          contracts land in <code>docs/api/</code>.
        </Text>
      </footer>
    </main>
  )
}
