import { describe, it, expect, vi, afterEach } from "vitest"
import { fetchWithTimeout } from "./http"

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe("fetchWithTimeout", () => {
  it("passes the init through and returns the response", async () => {
    const response = new Response("ok", { status: 200 })
    const fetchMock = vi.fn().mockResolvedValue(response)
    vi.stubGlobal("fetch", fetchMock)

    const result = await fetchWithTimeout("https://example.com/a.png", { method: "GET" }, 10_000)
    expect(result).toBe(response)
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/a.png", {
      method: "GET",
      signal: expect.any(AbortSignal),
    })
  })

  it("aborts and rejects when the timeout elapses", async () => {
    vi.useFakeTimers()
    let capturedSignal: AbortSignal | undefined
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: RequestInit) => {
        capturedSignal = init.signal ?? undefined
        return new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))
        })
      })
    )

    const pending = fetchWithTimeout("https://example.com/a.png", {}, 1000)
    const assertion = expect(pending).rejects.toMatchObject({ name: "AbortError" })
    vi.advanceTimersByTime(1001)
    await assertion
    expect(capturedSignal?.aborted).toBe(true)
  })

  it("clears the timer when fetch completes quickly", async () => {
    vi.useFakeTimers()
    const response = new Response("ok", { status: 200 })
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response))

    const result = await fetchWithTimeout("https://example.com/a.png", {}, 1000)
    expect(result).toBe(response)

    // If the timer leaked, advancing time would trigger an abort on a stale signal.
    vi.advanceTimersByTime(10_000)
    vi.runAllTimers()
  })
})
