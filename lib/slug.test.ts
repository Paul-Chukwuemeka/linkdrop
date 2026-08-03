import { describe, expect, it, vi, beforeEach } from "vitest";
import { slugify, getUniqueCardSlug } from "@/lib/slug";
import { prisma } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  prisma: {
    card: {
      findMany: vi.fn(),
    },
  },
}));

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("My Cool Card")).toBe("my-cool-card");
  });

  it("collapses strings into single hyphens", () => {
    expect(slugify("a  b   c")).toBe("a-b-c");
  });

  it("strips non-alphanumerics and edge hyphens", () => {
    expect(slugify("  --Demo Page!??--  ")).toBe("demo-page");
  });

  it("falls back to untitled for unusable input", () => {
    expect(slugify("!!!")).toBe("untitled");
    expect(slugify("")).toBe("untitled");
  });
});

describe("getUniqueCardSlug", () => {
  const findMany = prisma.card.findMany as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    findMany.mockReset();
  });

  it("returns the base slug when unused", async () => {
    findMany.mockResolvedValueOnce([]);
    await expect(getUniqueCardSlug("user-1", "My Card")).resolves.toBe("my-card");
  });

  it("appends a numeric suffix when the base slug is taken", async () => {
    findMany.mockResolvedValueOnce([
      { id: "other", slug: "my-card" },
    ]);
    await expect(getUniqueCardSlug("user-1", "My Card")).resolves.toBe("my-card-2");
  });

  it("skips the excluded card itself", async () => {
    findMany.mockResolvedValueOnce([
      { id: "same", slug: "my-card" },
      { id: "other", slug: "untitled" },
    ]);
    await expect(
      getUniqueCardSlug("user-1", "My Card", "same"),
    ).resolves.toBe("my-card");
  });

  it("increments until a free suffix is found", async () => {
    findMany.mockResolvedValueOnce([
      { id: "a", slug: "card" },
      { id: "b", slug: "card-2" },
      { id: "c", slug: "card-3" },
    ]);
    await expect(getUniqueCardSlug("user-1", "Card")).resolves.toBe("card-4");
  });

  it("matches slugs case-insensitively", async () => {
    findMany.mockResolvedValueOnce([{ id: "a", slug: "MY-CARD" }]);
    await expect(getUniqueCardSlug("user-1", "My Card")).resolves.toBe("my-card-2");
  });
});