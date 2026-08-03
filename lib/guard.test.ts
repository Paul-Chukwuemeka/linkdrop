import { describe, it, expect } from "vitest"
import { resolveGuardAction } from "./guard"

describe("resolveGuardAction", () => {
  it("redirects logged-in users away from / to /dashboard", () => {
    expect(resolveGuardAction(true, "/")).toEqual({ kind: "dashboard-redirect" })
  })

  it("lets logged-in users through on non-root paths", () => {
    expect(resolveGuardAction(true, "/dashboard")).toEqual({ kind: "next" })
    expect(resolveGuardAction(true, "/dashboard/cards")).toEqual({ kind: "next" })
    expect(resolveGuardAction(true, "/u/foo")).toEqual({ kind: "next" })
    expect(resolveGuardAction(true, "/login")).toEqual({ kind: "next" })
  })

  it("sends anonymous users to /login with the original path as next", () => {
    expect(resolveGuardAction(false, "/dashboard")).toEqual({ kind: "login-redirect", next: "/dashboard" })
    expect(resolveGuardAction(false, "/dashboard/cards")).toEqual({ kind: "login-redirect", next: "/dashboard/cards" })
    expect(resolveGuardAction(false, "/dashboard/appearance")).toEqual({ kind: "login-redirect", next: "/dashboard/appearance" })
  })

  it("does not redirect anonymous users on public paths", () => {
    expect(resolveGuardAction(false, "/")).toEqual({ kind: "next" })
    expect(resolveGuardAction(false, "/login")).toEqual({ kind: "next" })
    expect(resolveGuardAction(false, "/register")).toEqual({ kind: "next" })
    expect(resolveGuardAction(false, "/u/foo")).toEqual({ kind: "next" })
  })
})
