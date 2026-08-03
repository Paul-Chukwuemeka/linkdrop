import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    link: { findFirst: vi.fn(), update: vi.fn() },
    collection: { findFirst: vi.fn() },
  },
}))

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}))

vi.mock("@/lib/position-utils", () => ({
  getMaxPosition: vi.fn(),
}))

import { PATCH } from "./route"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { getMaxPosition } from "@/lib/position-utils"

const USER_ID = "user-owned"
const CARD_ID = "card-owned"
const FOREIGN_COLLECTION = "10000000-0000-4000-8000-000000000000"
const OWNED_COLLECTION = "20000000-0000-4000-8000-000000000000"

function makeRequest(collectionId: string | null): Request {
  return new Request("http://localhost/api/links/link-1", {
    method: "PATCH",
    body: JSON.stringify({ collection_id: collectionId }),
    headers: { "content-type": "application/json" },
  })
}

describe("PATCH /api/links/[linkId]", () => {
  beforeEach(() => {
    vi.mocked(requireAuth).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(prisma.link.findFirst).mockResolvedValue({
      id: "link-1",
      cardId: CARD_ID,
      card: { userId: USER_ID },
      collectionId: null as string | null,
      title: "Old title",
      url: "https://example.com",
      position: 1,
    } as never)
    vi.mocked(getMaxPosition).mockResolvedValue(1)
    vi.clearAllMocks()
  })

  it("rejects moving a link into a collection the user does not own", async () => {
    // The link's card does not own the collection, so the ownership check
    // returns not-found and the move is blocked.
    vi.mocked(prisma.collection.findFirst).mockResolvedValue(null)

    const response = await PATCH(makeRequest(FOREIGN_COLLECTION), {
      params: Promise.resolve({ linkId: "link-1" }),
    })

    expect(prisma.link.update).not.toHaveBeenCalled()
    expect(response.status).toBe(404)
  })

  it("allows moving a link into a collection owned by the link's card", async () => {
    vi.mocked(prisma.collection.findFirst).mockResolvedValue({
      id: OWNED_COLLECTION,
      cardId: CARD_ID,
    } as never)
    vi.mocked(prisma.link.update).mockResolvedValue({
      id: "link-1",
      cardId: CARD_ID,
      collectionId: OWNED_COLLECTION,
      title: "T",
      url: "https://example.com",
      position: 1,
    } as never)

    const response = await PATCH(makeRequest(OWNED_COLLECTION), {
      params: Promise.resolve({ linkId: "link-1" }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.collection_id).toBe(OWNED_COLLECTION)
  })
})