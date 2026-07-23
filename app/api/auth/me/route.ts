import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
    },
  })

  if (!user) {
    return NextResponse.json({ detail: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}
