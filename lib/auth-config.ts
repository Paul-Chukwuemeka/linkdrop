import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { loginSchema } from "@/lib/validations/auth"
import { prisma } from "@/lib/db"
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
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { username, password } = parsed.data

        const user = await prisma.user.findFirst({
          where: { username: { equals: username, mode: "insensitive" } },
        })

        if (!user || !user.password) return null

        const valid = await argon2.verify(user.password, password)
        if (!valid) return null

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
    ...(process.env.AUTH_GITHUB_ID
      ? [
          GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email!
        let dbUser = await prisma.user.findUnique({ where: { email } })

        if (!dbUser) {
          let username = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_")
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${username}_${Math.random().toString(36).substring(2, 6)}`
          }

          dbUser = await prisma.user.create({
            data: { username, email, fullname: user.name || username, avatarUrl: user.image },
          })
        }

        const exists = await prisma.account.findFirst({
          where: { provider: "google", providerAccountId: account.providerAccountId },
        })
        if (!exists) {
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              id_token: account.id_token,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
        if (dbUser) {
          token.id = dbUser.id
          token.username = dbUser.username
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
