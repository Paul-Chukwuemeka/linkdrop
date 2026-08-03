import { NextResponse } from "next/server"

export class UnauthorizedError extends Error {
  constructor(message = "Not authenticated") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { detail: message, ...(details ? { details } : {}) },
    { status }
  )
}

export function unauthorizedResponse(message = "Not authenticated") {
  return errorResponse(message, 401)
}

export function notFoundResponse(message = "Not found") {
  return errorResponse(message, 404)
}

export function conflictResponse(message: string) {
  return errorResponse(message, 409)
}

export function serverErrorResponse(message = "Internal server error") {
  return errorResponse(message, 500)
}

// Prisma unique-constraint violation (e.g. email/username already taken).
export function isP2002(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  )
}

// Read a JSON request body, returning null when the body is not valid JSON.
// Handlers should respond with errorResponse("Invalid JSON body", 400) in
// that case instead of letting the framework 500.
export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}
