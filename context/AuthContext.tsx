"use client";

import { apiFetch, ApiError } from "@/lib/api";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/lib/auth";
import type { AuthResponse, SignupRequest, UserAuth } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthContextValue {
  user: UserAuth | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasToken = Boolean(getAccessToken() || getRefreshToken());
    if (!hasToken) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const me = await apiFetch<UserAuth>("/auth/me", { onAuthFailure: "none" });
        if (isMounted) setUser(me);
      } catch {
        clearTokens();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isLoading,
      login: async (username: string, password: string) => {
        try {
          const res = await apiFetch<AuthResponse>("/auth/login", {
            method: "POST",
            json: { username, password },
            skipAuth: true,
          });
          setAccessToken(res.access_token);
          setRefreshToken(res.refresh_token);
          setUser(res.user);
          router.push("/dashboard");
        } catch (err) {
          if (err instanceof ApiError) throw err;
          throw err;
        }
      },
      register: async (data: SignupRequest) => {
        try {
          const res = await apiFetch<AuthResponse>("/auth/signup", {
            method: "POST",
            json: data,
            skipAuth: true,
          });
          setAccessToken(res.access_token);
          setRefreshToken(res.refresh_token);
          setUser(res.user);
          router.push("/dashboard");
        } catch (err) {
          if (err instanceof ApiError) throw err;
          throw err;
        }
      },
      logout: () => {
        clearTokens();
        setUser(null);
        router.push("/login");
      },
      refreshUser: async () => {
        try {
          const me = await apiFetch<UserAuth>("/auth/me", { onAuthFailure: "none" });
          setUser(me);
        } catch {
          clearTokens();
          setUser(null);
        }
      },
    };
  }, [isLoading, router, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within <AuthProvider />");
  }
  return ctx;
}
