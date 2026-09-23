import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const sendMock = vi.fn()

vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } }
  }),
}))

import { sendPasswordResetEmail } from "./email"

const OLD_ENV = { ...process.env }

describe("sendPasswordResetEmail", () => {
  beforeEach(() => {
    sendMock.mockReset()
    sendMock.mockResolvedValue({ data: { id: "email-1" }, error: null })
    process.env = { ...OLD_ENV, RESEND_API_KEY: "re_test_key" }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it("sends the reset link to the given address", async () => {
    const result = await sendPasswordResetEmail(
      "jane@example.com",
      "http://localhost:3000/reset-password?token=abc",
    )
    expect(result).toEqual({ delivered: true })
    expect(sendMock).toHaveBeenCalledOnce()
    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toBe("jane@example.com")
    expect(payload.text).toContain("http://localhost:3000/reset-password?token=abc")
  })

  it("returns delivered false and logs when resend reports an error", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "boom" } })
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const result = await sendPasswordResetEmail("jane@example.com", "http://x/y?token=abc")
    expect(result).toEqual({ delivered: false })
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it("logs instead of sending when no API key is configured", async () => {
    delete process.env.RESEND_API_KEY
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    const result = await sendPasswordResetEmail("jane@example.com", "http://x/y?token=abc")
    expect(result).toEqual({ delivered: false })
    expect(sendMock).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })
})
