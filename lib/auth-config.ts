import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { loginSchema } from "@/lib/validations/auth"
import { prisma } from "@/lib/db"
import { linkGoogleUser } from "@/lib/auth-merge"
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/rate-limit"
import argon2 from "argon2"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { username, password } = parsed.data

        // Per-IP and per-username throttling against credential stuffing.
        if (request && !checkLoginRateLimit(request, username, 10, 60_000)) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: { username: { equals: username, mode: "insensitive" } },
        })

        if (!user || !user.password) return null

        const valid = await argon2.verify(user.password, password)
        if (!valid) return null

        resetLoginRateLimit(username)

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.fullname,
        }
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = (user.email ?? "").toLowerCase()
        if (!email) return false
        const linked = await linkGoogleUser({
          email,
          name: user.name,
          image: user.image,
          account,
        })
        if (!linked) return false
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        const email = (user.email ?? "").toLowerCase()
        if (email) {
          const dbUser = await prisma.user.findUnique({ where: { email } })
          if (dbUser) {
            token.id = dbUser.id
            token.username = dbUser.username
          }
        }
      }
      if (user && "username" in user && user.username) {
        token.id = user.id
        token.username = (user as { username: string }).username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
