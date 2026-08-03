export type GuardAction =
  | { kind: "dashboard-redirect" }
  | { kind: "login-redirect"; next: string }
  | { kind: "next" }

export function resolveGuardAction(
  isLoggedIn: boolean,
  pathname: string
): GuardAction {
  if (isLoggedIn && pathname === "/") {
    return { kind: "dashboard-redirect" }
  }

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return { kind: "login-redirect", next: pathname }
  }

  return { kind: "next" }
}
