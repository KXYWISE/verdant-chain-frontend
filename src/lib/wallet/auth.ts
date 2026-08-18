import { signMessage } from "@stellar/freighter-api"
import { getAuthChallenge, verifyAuth } from "@/lib/api/auth"
import { setAuthToken } from "@/lib/api/client"
import type { AuthChallenge, AuthVerifyResponse } from "@/lib/api/types"
import { WalletError, getWalletSnapshot } from "./wallet"

/** Build the SEP-40 signed-payload message text per auth-flow.md v1.0. */
export function buildSep40Message(challenge: AuthChallenge): string {
  return `${challenge.domain} wants you to sign in with your Stellar account:\n${challenge.address}\n\nNonce: ${challenge.nonce}\nIssued At: ${challenge.timestamp}\n`
}

/** Normalize a Freighter signature to a base64 string. */
function toBase64(signedMessage: string | Uint8Array): string {
  if (typeof signedMessage === "string") return signedMessage
  let binary = ""
  for (const byte of signedMessage) binary += String.fromCharCode(byte)
  return btoa(binary)
}

/**
 * Sign in with Freighter via the SEP-40 flow:
 * connect → challenge → sign message → verify → store bearer token.
 */
export async function signInWithFreighter(): Promise<AuthVerifyResponse> {
  const snapshot = getWalletSnapshot()
  if (snapshot.state !== "connected") {
    throw new WalletError("not_connected", "Connect your wallet before signing in")
  }
  const address = snapshot.address

  const challenge = await getAuthChallenge(address)
  const message = buildSep40Message(challenge)

  let signature: string
  try {
    const res = await signMessage(message, { address })
    if (res.error) throw new WalletError("sign_failed", res.error.message)
    if (!res.signedMessage) throw new WalletError("sign_failed", "Freighter did not return a signature")
    signature = toBase64(res.signedMessage)
  } catch (error) {
    if (error instanceof WalletError) throw error
    throw new WalletError("sign_failed", "Freighter could not sign the message")
  }

  const session = await verifyAuth({
    address,
    domain: challenge.domain,
    nonce: challenge.nonce,
    timestamp: challenge.timestamp,
    signature,
  })

  setAuthToken(session.token)
  return session
}

/** Clear the stored bearer token. */
export function signOut(): void {
  setAuthToken(null)
}