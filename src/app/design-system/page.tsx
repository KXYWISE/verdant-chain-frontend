"use client"

import Link from "next/link"
import {
  Badge,
  Button,
  Card,
  Heading,
  Input,
  Spinner,
  StatusPill,
  Text,
  ThemeToggle,
} from "@/components/ui"
import styles from "./design-system.module.css"

const swatches = [
  ["primary", "--va-primary"],
  ["primary-container", "--va-primary-container"],
  ["secondary", "--va-secondary"],
  ["secondary-container", "--va-secondary-container"],
  ["tertiary", "--va-tertiary"],
  ["tertiary-container", "--va-tertiary-container"],
  ["surface", "--va-surface"],
  ["surface-container", "--va-surface-container"],
  ["surface-container-high", "--va-surface-container-high"],
  ["on-surface", "--va-on-surface"],
  ["on-surface-variant", "--va-on-surface-variant"],
  ["outline", "--va-outline"],
  ["outline-variant", "--va-outline-variant"],
  ["error", "--va-error"],
  ["success", "--va-success"],
  ["info", "--va-info"],
] as const

export default function DesignSystemPage() {
  return (
    <main className={styles.main}>
      <div className={styles.topbar}>
        <Link href="/">&larr; Back home</Link>
        <ThemeToggle />
      </div>

      <header className={styles.header}>
        <StatusPill tone="info" label="Foundation" />
        <Heading as="h1" size={1}>
          VerdAnt design system
        </Heading>
        <Text as="p" size="body-lg" tone="muted">
          Material 3 Expressive foundation with a distinct agricultural identity. Dark mode is
          first-class. Feature surfaces build on these primitives.
        </Text>
      </header>

      <section aria-labelledby="tokens-heading">
        <Heading as="h2" id="tokens-heading">
          Semantic color
        </Heading>
        <div className={styles.swatches}>
          {swatches.map(([name, token]) => (
            <div key={name} className={styles.swatch}>
              <div className={styles.swatchColor} style={{ background: `var(${token})` }} />
              <Text as="p" size="label-sm">
                {name}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="type-heading">
        <Heading as="h2" id="type-heading">
          Typography
        </Heading>
        <div className={styles.typeSamples}>
          <Heading as="h1" size={1}>
            Display — Harvest season begins
          </Heading>
          <Heading as="h2">Headline — Cooperative of the valley</Heading>
          <Heading as="h3">Title large — Northern irrigation systems</Heading>
          <Text as="p" size="body-lg">
            Body large: field reports verified against on-chain records.
          </Text>
          <Text as="p" size="body-sm" tone="muted">
            Body small muted: secondary guidance for forms and tables.
          </Text>
          <Text as="span" size="label-lg">
            Label — Region · District · Parcel
          </Text>
        </div>
      </section>

      <section aria-labelledby="buttons-heading">
        <Heading as="h2" id="buttons-heading">
          Buttons
        </Heading>
        <div className={styles.row}>
          <Button>Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button as="a" href="/" variant="outlined">
            As a link
          </Button>
        </div>
      </section>

      <section aria-labelledby="status-heading">
        <Heading as="h2" id="status-heading">
          Status
        </Heading>
        <div className={styles.row}>
          <StatusPill tone="success" label="Verified" />
          <StatusPill tone="pending" label="Pending" />
          <StatusPill tone="error" label="Failed" />
          <StatusPill tone="info" label="Indexed" />
          <StatusPill tone="neutral" label="Draft" />
          <Badge removable onRemove={() => undefined}>
            Wheat
          </Badge>
          <Badge>Maize</Badge>
        </div>
      </section>

      <section aria-labelledby="inputs-heading">
        <Heading as="h2" id="inputs-heading">
          Inputs
        </Heading>
        <div className={styles.formGrid}>
          <Input label="Field name" placeholder="e.g. North plot 7" />
          <Input label="Token amount" placeholder="0.00" hint="In Stellar units" />
          <Input label="Contract address" error="Required" />
        </div>
      </section>

      <section aria-labelledby="surface-heading">
        <Heading as="h2" id="surface-heading">
          Surfaces & feedback
        </Heading>
        <div className={styles.row}>
          <Card elevation={1}>
            <div className={styles.cardBody}>
              <Heading as="h3">Equipment</Heading>
              <Text as="p" size="body-sm" tone="muted">
                Card on surface-container.
              </Text>
            </div>
          </Card>
          <Card elevation={3}>
            <div className={styles.cardBody}>
              <Heading as="h3">Financing</Heading>
              <Text as="p" size="body-sm" tone="muted">
                Raised card with elevation-3.
              </Text>
            </div>
          </Card>
          <div className={styles.spinnerCell}>
            <Spinner size="md" />
            <Text as="span" size="label-md">
              Syncing…
            </Text>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <Text as="p" size="body-sm" tone="muted">
          Tokens live in <code>src/styles/tokens/</code>; primitives in{" "}
          <code>src/components/ui/</code>.
        </Text>
      </footer>
    </main>
  )
}
