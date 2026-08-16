const DEFAULT_BASE_URL = "/api/v1"

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL
}
