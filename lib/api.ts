import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/lib/auth";
import type { AuthResponse, RefreshTokenRequest } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  json?: unknown;
  skipAuth?: boolean;
  onAuthFailure?: "redirect" | "none";
};

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your env (see .env.example).",
    );
  }
  return base;
}

async function readErrorPayload(res: Response): Promise<{ message: string; details?: unknown }> {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = (await res.json()) as unknown;
      if (
        typeof data === "object" &&
        data !== null &&
        "detail" in data &&
        typeof (data as { detail?: unknown }).detail === "string"
      ) {
        return { message: (data as { detail: string }).detail, details: data };
      }
      return { message: res.statusText || "Request failed", details: data };
    } catch {
      return { message: res.statusText || "Request failed" };
    }
  }

  try {
    const text = await res.text();
    return { message: text || res.statusText || "Request failed" };
  } catch {
    return { message: res.statusText || "Request failed" };
  }
}

async function refreshTokenPair(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const base = getApiBaseUrl();
  const url = new URL("/auth/refresh", base);

  let res: Response;
  try {
    const payload: RefreshTokenRequest = { refresh_token: refreshToken };
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return false;
  }

  if (!res.ok) return false;

  const data = (await res.json()) as AuthResponse;
  if (!data.access_token || !data.refresh_token) return false;
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  return true;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return;
  window.location.assign("/login");
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const base = getApiBaseUrl();
  const url = new URL(path, base);

  const { json, skipAuth, headers, onAuthFailure = "redirect", ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");

  let body = rest.body;
  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token && !finalHeaders.has("Authorization")) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const requestInit: RequestInit = { ...rest, headers: finalHeaders, body };

  let res = await fetch(url, requestInit);

  if (res.status === 401 && !skipAuth) {
    const refreshed = await refreshTokenPair();
    if (!refreshed) {
      clearTokens();
      if (onAuthFailure === "redirect") redirectToLogin();
      const errPayload = await readErrorPayload(res);
      throw new ApiError(401, errPayload.message, errPayload.details);
    }

    const token = getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    res = await fetch(url, { ...requestInit, headers: finalHeaders });
  }

  if (!res.ok) {
    const errPayload = await readErrorPayload(res);
    throw new ApiError(res.status, errPayload.message, errPayload.details);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
