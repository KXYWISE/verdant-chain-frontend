export type VerificationMarker = {
  kind: string
  issuer: string
  issuedLedger: number
}

export type FarmerProfileMetadata = {
  name: string
  region?: string
  district?: string
  bio?: string
  profileImageHash?: string
}

export type FarmerMetadataBlock = {
  hash: string
  profile: FarmerProfileMetadata
}

export type FarmerRecord = {
  address: string
  id: string
  registered: boolean
  createdLedger?: number
  updatedLedger?: number
  metadata?: FarmerMetadataBlock
  verificationMarkers?: VerificationMarker[]
}

export type RegisterFarmerInput = {
  address: string
  metadata: FarmerProfileMetadata
  metadataHash?: string
}
