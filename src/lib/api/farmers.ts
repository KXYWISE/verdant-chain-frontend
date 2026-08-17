import { api } from "./client"
import type { FarmerProfileMetadata, FarmerRecord, FarmerSearchResponse, RegisterFarmerInput, SearchFarmersParams } from "./types"

export async function getFarmer(address: string): Promise<FarmerRecord> {
  return api.get<FarmerRecord>(`/farmers/${encodeURIComponent(address)}`)
}

export async function searchFarmers(params: SearchFarmersParams): Promise<FarmerSearchResponse> {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set("q", params.q)
  if (params.page) searchParams.set("page", String(params.page))
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
  return api.get<FarmerSearchResponse>(`/farmers${query}`)
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
