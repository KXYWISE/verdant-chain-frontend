import { describe, expect, it } from "vitest"
import {
  isStellarPublicKey,
  normalizeAddress,
  shortAddress,
  stripFarmerPrefix,
  toFarmerId,
} from "./address"

const KEY = `G${"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".repeat(2).slice(0, 55)}`
const FARMER_ID = `va:farmer:${KEY}`

describe("isStellarPublicKey", () => {
  it("accepts a 56-char G… key", () => {
    expect(isStellarPublicKey(KEY)).toBe(true)
  })

  it("rejects malformed keys", () => {
    expect(isStellarPublicKey("")).toBe(false)
    expect(
      isStellarPublicKey("HABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ234567")
    ).toBe(false)
    expect(isStellarPublicKey(KEY.slice(0, 55))).toBe(false)
    expect(isStellarPublicKey(`${KEY}0`)).toBe(false)
    expect(isStellarPublicKey(`va:farmer:${KEY}`)).toBe(false)
  })
})

describe("stripFarmerPrefix / normalizeAddress", () => {
  it("strips the va:farmer: prefix", () => {
    expect(stripFarmerPrefix(FARMER_ID)).toBe(KEY)
    expect(stripFarmerPrefix(KEY)).toBe(KEY)
  })

  it("normalizes whitespace", () => {
    expect(normalizeAddress(` ${FARMER_ID} `)).toBe(KEY)
  })
})

describe("toFarmerId", () => {
  it("wraps a bare key in the va:farmer: form (AD-009)", () => {
    expect(toFarmerId(KEY)).toBe(FARMER_ID)
  })

  it("is idempotent on the va:farmer: form", () => {
    expect(toFarmerId(FARMER_ID)).toBe(FARMER_ID)
  })

  it("throws on an invalid key", () => {
    expect(() => toFarmerId("not-a-key")).toThrow("Invalid Stellar public key")
  })
})

describe("shortAddress", () => {
  it("truncates the middle of a long key", () => {
    expect(shortAddress(FARMER_ID)).toBe(`${KEY.slice(0, 6)}…${KEY.slice(-4)}`)
  })

  it("keeps short values as-is", () => {
    expect(shortAddress("GABC")).toBe("GABC")
  })
})
