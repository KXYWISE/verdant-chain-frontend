const FARMER_PREFIX = "va:farmer:"

// Stellar ed25519 public key strkey: leading "G" + 55 base32 chars (A-Z, 2-7).
const STELLAR_KEY_RE = /^G[A-Z2-7]{55}$/

export function isStellarPublicKey(value: string): boolean {
  return STELLAR_KEY_RE.test(value)
}

export function stripFarmerPrefix(value: string): string {
  return value.startsWith(FARMER_PREFIX) ? value.slice(FARMER_PREFIX.length) : value
}

/** Accept a raw G… key or `va:farmer:G…` and return the bare public key. */
export function normalizeAddress(value: string): string {
  return stripFarmerPrefix(value.trim())
}

/** Present a public key in the canonical `va:farmer:G…` form (AD-009). */
export function toFarmerId(address: string): string {
  const key = stripFarmerPrefix(address.trim())
  if (!isStellarPublicKey(key)) {
    throw new Error(`Invalid Stellar public key: ${address}`)
  }
  return `${FARMER_PREFIX}${key}`
}

/** Short, display-safe form of a full identifier. */
export function shortAddress(address: string): string {
  const key = stripFarmerPrefix(address)
  if (key.length <= 12) return key
  return `${key.slice(0, 6)}…${key.slice(-4)}`
}
