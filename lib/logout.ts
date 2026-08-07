"use client";

import { signOut } from "next-auth/react";

const COOKIE_BASES = [
  "authjs.session-token",
  "authjs.csrf-token",
  "authjs.callback-url",
  "authjs.state",
  "authjs.pkce.code_verifier",
  "authjs.nonce",
  "authjs.challenge",
  "next-auth.session-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
  "next-auth.state",
  "next-auth.pkce.code_verifier",
];

function deleteCookie(name: string) {
  const secure = name.startsWith("__") ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Expires=${new Date(0).toUTCString()}; SameSite=Lax${secure}`;
}

function purgeAuthCookies() {
  for (const base of COOKIE_BASES) {
    deleteCookie(base);
    deleteCookie(`__Secure-${base}`);
    deleteCookie(`__Host-${base}`);
  }
  for (let i = 0; i < 10; i++) {
    deleteCookie(`authjs.session-token.${i}`);
    deleteCookie(`__Secure-authjs.session-token.${i}`);
    deleteCookie(`__Host-authjs.session-token.${i}`);
  }
}

// Auth.js signout only clears the session token. This additionally purges the
// CSRF/callback-url cookies and any stale __Secure-/__Host- (or legacy
// next-auth.*) variants left behind by previously-secure configs.
export async function logout() {
  await signOut({ redirect: false, callbackUrl: "/login" });
  purgeAuthCookies();
  window.location.replace("/login");
}