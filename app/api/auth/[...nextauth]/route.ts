import { handlers } from "@/lib/auth-config"
import { checkRateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"

const originalGET = handlers.GET
const originalPOST = handlers.POST

handlers.GET = async function GET(request: NextRequest) {
  if (!checkRateLimit(request, 30, 60_000)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }
  return originalGET(request)
}

handlers.POST = async function POST(request: NextRequest) {
  if (!checkRateLimit(request, 10, 60_000)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }
  return originalPOST(request)
}

export const { GET, POST } = handlers
