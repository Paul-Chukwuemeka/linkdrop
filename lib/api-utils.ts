import { NextResponse } from "next/server"

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
