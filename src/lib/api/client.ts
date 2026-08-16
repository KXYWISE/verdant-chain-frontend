import { getBaseUrl } from "./config"

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, "Could not reach the VerdAnt API")
  }

  if (!res.ok) {
    throw await toApiError(res)
  }
  return (await res.json()) as T
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = `Request failed with status ${res.status}`
  try {
    const body = (await res.json()) as { error?: string }
    if (body?.error) message = body.error
  } catch {
    // non-JSON error body; keep the status fallback message
  }
  return new ApiError(res.status, message)
}

export const api = {
  get<T>(path: string) {
    return request<T>(path)
  },
  post<T>(path: string, body: unknown) {
    return request<T>(path, { method: "POST", body: JSON.stringify(body) })
  },
  put<T>(path: string, body: unknown) {
    return request<T>(path, { method: "PUT", body: JSON.stringify(body) })
  },
}
