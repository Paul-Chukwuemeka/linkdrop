import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    card: { findFirst: vi.fn() },
  },
}))

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}))

vi.mock("@/lib/s3", () => ({
  r2: { send: vi.fn() },
  R2_BUCKET: "linkinbio",
  R2_PUBLIC_URL: "https://cdn.example.com",
  deleteFromR2: vi.fn(),
}))

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: vi.fn(function (input: object) {
    return { ...input }
  }),
}))

import { POST } from "./route"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { r2, deleteFromR2 } from "@/lib/s3"
import { UnauthorizedError } from "@/lib/api-utils"

const USER_ID = "user-1"
const CARD_ID = "card-1"

function makeRequest(file: File | null): Request {
  const formData = new FormData()
  if (file) formData.append("file", file)
  return new Request("http://localhost/api/cards/card-1/background", {
    method: "POST",
    body: formData,
  })
}

function makeFile(type = "image/png", bytes = 100): File {
  return new File([new Uint8Array(bytes)], "bg.png", { type })
}

describe("POST /api/cards/[cardId]/background", () => {
  beforeEach(() => {
    vi.mocked(requireAuth).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(prisma.card.findFirst).mockResolvedValue({
      id: CARD_ID,
      userId: USER_ID,
      style: { profile_image: null },
    } as never)
    vi.mocked(r2.send).mockResolvedValue({} as never)
    vi.mocked(deleteFromR2).mockResolvedValue(undefined)
    vi.clearAllMocks()
  })

  it("returns 401 without auth", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError())
    const response = await POST(makeRequest(makeFile()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(401)
  })

  it("returns 404 for a card the user does not own", async () => {
    vi.mocked(prisma.card.findFirst).mockResolvedValue(null)
    const response = await POST(makeRequest(makeFile()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(404)
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("returns 400 when no file is provided", async () => {
    const response = await POST(makeRequest(null), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(400)
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("returns 400 for an unsupported content type", async () => {
    const response = await POST(makeRequest(makeFile("text/plain")), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(400)
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("returns 413 for files over 5MB", async () => {
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "bg.png", {
      type: "image/png",
    })
    const response = await POST(makeRequest(big), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(413)
    expect(r2.send).not.toHaveBeenCalled()
  })

  it("uploads the file and returns the public URL", async () => {
    const response = await POST(makeRequest(makeFile("image/png")), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(200)
    const body = (await response.json()) as { url: string }
    expect(body.url).toMatch(
      /^https:\/\/cdn\.example\.com\/backgrounds\/[a-f0-9]{64}\.png$/,
    )
    expect(r2.send).toHaveBeenCalledOnce()
  })

  it("cleans up the previous background image when replacing", async () => {
    vi.mocked(prisma.card.findFirst).mockResolvedValue({
      id: CARD_ID,
      userId: USER_ID,
      style: { profile_image: "https://cdn.example.com/backgrounds/old.png" },
    } as never)
    const response = await POST(makeRequest(makeFile("image/png")), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(200)
    expect(deleteFromR2).toHaveBeenCalledWith(
      "https://cdn.example.com/backgrounds/old.png",
    )
  })
})
