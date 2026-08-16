import { api } from "./client"
import type { FarmerProfileMetadata, FarmerRecord, RegisterFarmerInput } from "./types"

export async function getFarmer(address: string): Promise<FarmerRecord> {
  return api.get<FarmerRecord>(`/farmers/${encodeURIComponent(address)}`)
}

export async function registerFarmer(input: RegisterFarmerInput): Promise<FarmerRecord> {
  return api.post<FarmerRecord>("/farmers/register", input)
}

export async function updateFarmerMetadata(
  address: string,
  metadata: FarmerProfileMetadata
): Promise<FarmerRecord> {
  return api.put<FarmerRecord>(`/farmers/${encodeURIComponent(address)}/metadata`, { metadata })
}
