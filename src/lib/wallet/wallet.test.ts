import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const KEY = "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ23456"

const mockIsConnected = vi.fn()
const mockGetAddress = vi.fn()
const mockRequestAccess = vi.fn()

vi.mock("@stellar/freighter-api", () => ({
  isConnected: mockIsConnected,
  getAddress: mockGetAddress,
  requestAccess: mockRequestAccess,
  WatchWalletChanges: vi.fn(),
}))

let walletModule: typeof import("./wallet")

async function importWallet() {
  return import("./wallet")
}

beforeEach(async () => {
  vi.restoreAllMocks()
  mockIsConnected.mockReset()
  mockGetAddress.mockReset()
  mockRequestAccess.mockReset()
  vi.stubGlobal("window", { freighter: {}, location: { origin: "http://localhost" } })
  walletModule = await importWallet()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockConnected(address = KEY) {
  mockIsConnected.mockResolvedValue({ isConnected: true })
  mockGetAddress.mockResolvedValue({ address })
  mockRequestAccess.mockResolvedValue({ address })
}

function mockDisconnected() {
  mockIsConnected.mockResolvedValue({ isConnected: false })
  mockGetAddress.mockResolvedValue({ error: { code: "not_connected", message: "not connected" } })
  mockRequestAccess.mockResolvedValue({
    error: { code: "not_connected", message: "not connected" },
  })
}

function mockError(error = { code: "unavailable", message: "no freighter" }) {
  mockIsConnected.mockResolvedValue({ error })
  mockGetAddress.mockResolvedValue({ error })
  mockRequestAccess.mockResolvedValue({ error })
}

describe("wallet store", () => {
  it("starts disconnected", () => {
    expect(walletModule.getWalletSnapshot()).toEqual({ state: "disconnected" })
  })

  it("syncWallet sets connected state when Freighter is connected", async () => {
    mockConnected()
    await walletModule.syncWallet()
    expect(walletModule.getWalletSnapshot()).toEqual({ state: "connected", address: KEY })
    expect(mockIsConnected).toHaveBeenCalled()
    expect(mockGetAddress).toHaveBeenCalled()
  })

  it("syncWallet stays disconnected when Freighter not connected", async () => {
    mockDisconnected()
    await walletModule.syncWallet()
    expect(walletModule.getWalletSnapshot()).toEqual({ state: "disconnected" })
    expect(mockIsConnected).toHaveBeenCalled()
  })

  it("connectWallet requests access and sets connected state", async () => {
    mockConnected()
    await walletModule.connectWallet()
    expect(walletModule.getWalletSnapshot()).toEqual({ state: "connected", address: KEY })
    expect(mockRequestAccess).toHaveBeenCalled()
  })

  it("connectWallet throws WalletError when Freighter unavailable", async () => {
    mockError()
    await expect(walletModule.connectWallet()).rejects.toThrow(walletModule.WalletError)
    expect(walletModule.getWalletSnapshot().state).toBe("unavailable")
  })

  it("disconnectWallet returns to disconnected", async () => {
    mockConnected()
    await walletModule.connectWallet()
    walletModule.disconnectWallet()
    expect(walletModule.getWalletSnapshot()).toEqual({ state: "disconnected" })
  })

  it("subscribe notifies listeners on state change", async () => {
    mockConnected()
    await walletModule.syncWallet()
    const listener = vi.fn()
    const unsubscribe = walletModule.subscribeWallet(listener)
    walletModule.disconnectWallet()
    expect(listener).toHaveBeenCalled()
    unsubscribe()
    listener.mockClear()
    await walletModule.syncWallet()
    expect(listener).not.toHaveBeenCalled()
  })
})
