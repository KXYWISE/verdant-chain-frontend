"use client"

import { useState } from "react"
import { Card } from "@/components/ui"
import { Heading, Text, StatusPill, Button, Spinner, Input } from "@/components/ui"
import { getFarmer } from "@/lib/api/farmers"
import { isNotFound } from "@/lib/api/client"
import { toFarmerId, shortAddress } from "@/lib/api/address"
import { Grid, Stack } from "@/components/ui"
import styles from "./search-discovery.module.css"

export function SearchDiscoveryClient() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<{
    farmer: Awaited<ReturnType<typeof getFarmer>> | null
    error: Error | null
    loading: boolean
  }>({ farmer: null, error: null, loading: false })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = query.trim()
    if (!normalized) return
    setResult({ farmer: null, error: null, loading: true })
    try {
      const farmer = await getFarmer(normalized)
      setResult({ farmer, error: null, loading: false })
    } catch (error) {
      setResult({ farmer: null, error: error as Error, loading: false })
    }
  }

  return (
    <div className={styles.container}>
      <Heading as="h2">AgriScout Discovery</Heading>
      <Text as="p" tone="muted" className={styles.subtitle}>
        Look up a farmer by Stellar public key or <code>va:farmer:G…</code> identifier. No directory
        listing is available yet — search by exact address.
      </Text>

      <form onSubmit={handleSearch} className={styles.form}>
        <Input
          label="Farmer address"
          placeholder="GABCD… or va:farmer:GABCD…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" loading={false}>
          Search
        </Button>
      </form>

      {result.loading && (
        <Spinner size="md" label="Looking up farmer…" className={styles.spinner} />
      )}

      {result.error && (
        <Card elevation={1} className={styles.errorCard}>
          {isNotFound(result.error) ? (
            <>
              <StatusPill tone="error" label="Not found" />
              <Text as="p">No farmer registered at that address.</Text>
            </>
          ) : (
            <>
              <StatusPill tone="error" label="Error" />
              <Text as="p" tone="error">
                {result.error?.message ?? "Unknown error"}
              </Text>
            </>
          )}
        </Card>
      )}

      {result.farmer && (
        <Card elevation={1} className={styles.resultCard}>
          <div className={styles.header}>
            <StatusPill
              tone={result.farmer.registered ? "success" : "pending"}
              label={result.farmer.registered ? "Registered" : "Not registered"}
            />
            {result.farmer.id && <span className={styles.farmerId}>{result.farmer.id}</span>}
          </div>
          <div className={styles.meta}>
            {result.farmer.metadata && (
              <>
                <p>
                  <strong>Name:</strong> {result.farmer.metadata.profile.name}
                </p>
                {result.farmer.metadata.profile.region && (
                  <p>
                    <strong>Region:</strong> {result.farmer.metadata.profile.region}
                  </p>
                )}
                {result.farmer.metadata.profile.district && (
                  <p>
                    <strong>District:</strong> {result.farmer.metadata.profile.district}
                  </p>
                )}
                {result.farmer.metadata.profile.bio && (
                  <p>
                    <strong>Bio:</strong> {result.farmer.metadata.profile.bio}
                  </p>
                )}
              </>
            )}
            {result.farmer.verificationMarkers && result.farmer.verificationMarkers.length > 0 && (
              <div className={styles.markers}>
                {result.farmer.verificationMarkers.map((marker, i) => (
                  <span key={i} className={styles.marker}>
                    <StatusPill tone="info" label={marker.kind} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      <section className={styles.future} aria-labelledby="future-heading">
        <Heading as="h3" id="future-heading">
          Directory & reputation (coming in Phase 4)
        </Heading>
        <Grid cols={3} gap={4} responsive className={styles.futureGrid}>
          <Card elevation={1} container>
            <Heading as="h4">Verified farmers</Heading>
            <Text tone="muted">Directory of farmers with on-chain verification markers.</Text>
          </Card>
          <Card elevation={1} container>
            <Heading as="h4">Reputation scores</Heading>
            <Text tone="muted">Aggregated scores from verification history and activity.</Text>
          </Card>
          <Card elevation={1} container>
            <Heading as="h4">Opportunity matching</Heading>
            <Text tone="muted">Connect farmers with buyers, equipment, and financing.</Text>
          </Card>
        </Grid>
        <Text tone="muted" className={styles.note}>
          The Farmer API contract (<code>docs/api/farmers.md</code>) currently defines only{" "}
          <code>GET /farmers/:address</code>. A list/search endpoint will be requested from Agent #4
          for the full AgriScout directory.
        </Text>
      </section>
    </div>
  )
}
