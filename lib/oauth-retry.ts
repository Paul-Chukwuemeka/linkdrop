const RETRYABLE_ERRORS = new Set(["ETIMEDOUT", "ENOTFOUND", "ECONNRESET", "ECONNREFUSED"])

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = 2,
  baseDelayMs = 1000,
): Promise<Response> {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(input, init)
    } catch (error: unknown) {
      lastError = error

      if (error instanceof Error && RETRYABLE_ERRORS.has((error as NodeJS.ErrnoException).code ?? "")) {
        console.error(
          `[oauth-retry] Attempt ${attempt + 1}/${retries + 1} failed with ${String((error as NodeJS.ErrnoException).code)}: ${error.message}`,
        )
        if (attempt < retries) {
          await sleep(baseDelayMs * Math.pow(2, attempt))
          continue
        }
      }

      throw error
    }
  }

  throw lastError
}
