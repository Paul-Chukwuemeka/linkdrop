import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    card: { findFirst: vi.fn() },
    collection: { findFirst: vi.fn() },
    link: { count: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}))

import { PATCH } from "./route"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"

const USER_ID = "user-owned"
const CARD_ID = "20000000-0000-4000-8000-000000000000"
const COLLECTION_ID = "30000000-0000-4000-8000-000000000000"
const FOREIGN_COLLECTION = "40000000-0000-4000-8000-000000000000"

const LINK_A = "aaaaaaaa-0000-4000-8000-000000000001"
const LINK_B = "aaaaaaaa-0000-4000-8000-000000000002"

function makeBody(
  overrides: Partial<{
    collection_id: string | null
    items: { id: string; position: number }[]
  }> = {},
): string {
  return JSON.stringify({
    collection_id: COLLECTION_ID,
    items: [
      { id: LINK_A, position: 0 },
      { id: LINK_B, position: 1 },
    ],
    ...overrides,
  })
}

function makeRequest(body: string): Request {
  return new Request("http://localhost/api/cards/card-1/links/reorder", {
    method: "PATCH",
    body,
    headers: { "content-type": "application/json" },
  })
}

describe("PATCH /api/cards/[cardId]/links/reorder", () => {
  beforeEach(() => {
    vi.mocked(requireAuth).mockResolvedValue({ id: USER_ID } as never)
    vi.mocked(prisma.card.findFirst).mockResolvedValue({
      id: CARD_ID,
      userId: USER_ID,
    } as never)
    vi.mocked(prisma.collection.findFirst).mockResolvedValue({
      id: COLLECTION_ID,
      cardId: CARD_ID,
    } as never)
    vi.mocked(prisma.link.count).mockResolvedValue(2)
    vi.mocked(prisma.link.findMany).mockResolvedValue([
      { id: LINK_A, cardId: CARD_ID, collectionId: COLLECTION_ID },
      { id: LINK_B, cardId: CARD_ID, collectionId: COLLECTION_ID },
    ] as never)
    vi.mocked(prisma.$transaction).mockImplementation(
      (async (fn: unknown) => {
        await (fn as (tx: typeof prisma) => Promise<unknown>)(prisma as never)
      }) as never,
    )
    vi.clearAllMocks()
  })

  it("requires authentication", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new Error("unauth"))
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(500)
  })

  it("rejects reordering when the card is not owned by the user", async () => {
    vi.mocked(prisma.card.findFirst).mockResolvedValue(null)
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(404)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("rejects a collection that does not belong to the card", async () => {
    vi.mocked(prisma.collection.findFirst).mockResolvedValue(null)
    const response = await PATCH(
      makeRequest(makeBody({ collection_id: FOREIGN_COLLECTION })),
      { params: Promise.resolve({ cardId: CARD_ID }) },
    )
    expect(response.status).toBe(404)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("rejects a payload that does not include every link in scope", async () => {
    vi.mocked(prisma.link.count).mockResolvedValue(3)
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(422)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("rejects duplicate links in the payload", async () => {
    const response = await PATCH(
      makeRequest(
        makeBody({
          items: [
            { id: LINK_A, position: 0 },
            { id: LINK_A, position: 1 },
          ],
        }),
      ),
      { params: Promise.resolve({ cardId: CARD_ID }) },
    )
    expect(response.status).toBe(422)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("rejects duplicate positions in the payload", async () => {
    const response = await PATCH(
      makeRequest(
        makeBody({
          items: [
            { id: LINK_A, position: 0 },
            { id: LINK_B, position: 0 },
          ],
        }),
      ),
      { params: Promise.resolve({ cardId: CARD_ID }) },
    )
    expect(response.status).toBe(422)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("rejects a link that is not in the given scope", async () => {
    vi.mocked(prisma.link.findMany).mockResolvedValue([{ id: LINK_A }] as never)
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(404)
    expect(prisma.link.update).not.toHaveBeenCalled()
  })

  it("applies new positions in a transaction", async () => {
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })

    expect(response.status).toBe(204)
    expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    expect(prisma.link.update).toHaveBeenCalledTimes(2)
    expect(prisma.link.update).toHaveBeenCalledWith({
      where: { id: LINK_A },
      data: { position: 0 },
    })
    expect(prisma.link.update).toHaveBeenCalledWith({
      where: { id: LINK_B },
      data: { position: 1 },
    })
  })

  it("returns 204 early when the scope has no links", async () => {
    vi.mocked(prisma.link.count).mockResolvedValue(0)
    const response = await PATCH(makeRequest(makeBody()), {
      params: Promise.resolve({ cardId: CARD_ID }),
    })
    expect(response.status).toBe(204)
    expect(prisma.link.findMany).not.toHaveBeenCalled()
  })
})