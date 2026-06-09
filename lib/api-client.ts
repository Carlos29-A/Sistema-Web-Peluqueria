export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type SuccessEnvelope<T,M > = { success: true; data: T; meta?: M  }
type ErrorEnvelope = { success: false; error: { message: string; issues?: string[] } }

type ApiResponse<T, M > = SuccessEnvelope<T, M> | ErrorEnvelope

export class ApiError extends Error {
    constructor(
        message: string,
        public issues?: string[]
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export async function apiFetch<T>(
  url: string,
  init?: RequestInit
): Promise<{ data: T }>

export async function apiFetch<T, M>(
  url: string,
  init?: RequestInit
): Promise<{ data: T; meta: M }>

export async function apiFetch<T, M = undefined>(
  url: string,
  init?: RequestInit
): Promise<{ data: T; meta?: M }> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  const json: ApiResponse<T, M> = await res.json()

  if (!json.success) {
    throw new ApiError(json.error.message, json.error.issues)
  }

  return { data: json.data, meta: json.meta }
}