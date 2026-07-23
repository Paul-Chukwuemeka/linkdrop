export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit
  json?: unknown
  skipAuth?: boolean
}

async function readErrorPayload(res: Response): Promise<{ message: string; details?: unknown }> {
  const contentType = res.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    try {
      const data = (await res.json()) as unknown
      if (
        typeof data === "object" &&
        data !== null &&
        "detail" in data &&
        typeof (data as { detail?: unknown }).detail === "string"
      ) {
        return { message: (data as { detail: string }).detail, details: data }
      }
      return { message: res.statusText || "Request failed", details: data }
    } catch {
      return { message: res.statusText || "Request failed" }
    }
  }

  try {
    const text = await res.text()
    return { message: text || res.statusText || "Request failed" }
  } catch {
    return { message: res.statusText || "Request failed" }
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { json, skipAuth: _, headers, ...rest } = options

  const finalHeaders = new Headers(headers)
  finalHeaders.set("Accept", "application/json")

  let body = rest.body
  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json")
    body = JSON.stringify(json)
  }

  // Auth.js session cookie is sent automatically for same-origin requests
  const requestInit: RequestInit = { ...rest, headers: finalHeaders, body, credentials: "include" }

  const res = await fetch(path, requestInit)

  if (!res.ok) {
    const errPayload = await readErrorPayload(res)
    throw new ApiError(res.status, errPayload.message, errPayload.details)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
