const ACCESS_TOKEN_KEY = "linkforge_access_token";
const REFRESH_TOKEN_KEY = "linkforge_refresh_token";

// Tokens are stored in localStorage for simplicity and to match the backend's
// Authorization: Bearer token scheme. A lightweight cookie flag is used to let
// Next.js Proxy block/allow /dashboard navigations.
const SESSION_COOKIE_KEY = "lf_session";

function setSessionCookie(isAuthenticated: boolean) {
  if (typeof document === "undefined") return;

  if (!isAuthenticated) {
    document.cookie = `${SESSION_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const maxAgeSeconds = 60 * 60 * 24 * 14;
  document.cookie = `${SESSION_COOKIE_KEY}=1; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  setSessionCookie(true);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  setSessionCookie(true);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  setSessionCookie(false);
}

