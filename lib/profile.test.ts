import { describe, it, expect } from "vitest"
import { toProfileResponse } from "./profile"

describe("toProfileResponse", () => {
  it("includes every field of the profile contract, including last_selected_card", () => {
    const row = {
      id: "u1",
      username: "jane",
      email: "jane@example.com",
      fullname: "Jane Doe",
      bio: "hi",
      avatarUrl: "/avatars/a.jpg",
      theme: "dark",
      currentCard: "c1",
      lastSelectedCard: "c2",
    }

    expect(toProfileResponse(row)).toEqual({
      id: "u1",
      username: "jane",
      email: "jane@example.com",
      fullname: "Jane Doe",
      bio: "hi",
      avatar_url: "/avatars/a.jpg",
      theme: "dark",
      current_card: "c1",
      last_selected_card: "c2",
    })
  })

  it("passes null through for nullable fields", () => {
    expect(
      toProfileResponse({
        id: "u1",
        username: "b",
        email: "b@example.com",
        fullname: "B",
        bio: null,
        avatarUrl: null,
        theme: "default",
        currentCard: null,
        lastSelectedCard: null,
      }).last_selected_card
    ).toBeNull()
  })
})