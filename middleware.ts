import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "ubic_admin_session"
const encoder = new TextEncoder()

function unauthorized(isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  })
}

function safeEqualString(a: string, b: string): boolean {
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  if (aBytes.length !== bBytes.length) return false

  let mismatch = 0
  for (let i = 0; i < aBytes.length; i += 1) {
    mismatch |= aBytes[i] ^ bBytes[i]
  }
  return mismatch === 0
}

function parseBasicAuth(header: string): { user: string; password: string } | null {
  const [scheme, encoded] = header.split(" ")
  if (!scheme || scheme.toLowerCase() !== "basic" || !encoded) return null

  try {
    const decoded = atob(encoded)
    const separator = decoded.indexOf(":")
    if (separator < 0) return null
    return {
      user: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    }
  } catch {
    return null
  }
}

async function expectedSessionToken(user: string, pass: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || pass
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`ubic-admin:${user}`))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function withSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next()
  }

  const expectedUser = process.env.ADMIN_USER || ""
  const expectedPass = process.env.ADMIN_PASS || ""

  if (!expectedUser || !expectedPass) {
    return unauthorized(isAdminApi)
  }

  const sessionToken = await expectedSessionToken(expectedUser, expectedPass)
  const cookieToken = request.cookies.get(SESSION_COOKIE)?.value || ""

  if (cookieToken && safeEqualString(cookieToken, sessionToken)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return unauthorized(isAdminApi)
  }

  const credentials = parseBasicAuth(authHeader)
  if (!credentials) {
    return unauthorized(isAdminApi)
  }

  const userOk = safeEqualString(credentials.user, expectedUser)
  const passOk = safeEqualString(credentials.password, expectedPass)

  if (!userOk || !passOk) {
    return unauthorized(isAdminApi)
  }

  return withSessionCookie(NextResponse.next(), sessionToken)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
