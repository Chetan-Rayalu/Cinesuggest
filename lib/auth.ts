import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const GUEST_COOKIE_NAME = "cinesuggest_session_id";

export async function getSessionUserId(request?: NextRequest): Promise<string> {
  // 1. Check custom header (from client fetch)
  if (request) {
    const headerId = request.headers.get("x-user-session-id");
    if (headerId && headerId.trim().length > 0) {
      return sanitizeUserId(headerId.trim());
    }

    // 2. Check cookies from NextRequest
    const cookieVal = request.cookies.get(GUEST_COOKIE_NAME)?.value;
    if (cookieVal && cookieVal.trim().length > 0) {
      return sanitizeUserId(cookieVal.trim());
    }
  }

  // 3. Fallback to next/headers cookies if in Server Component/Action context
  try {
    const cookieStore = await cookies();
    const stored = cookieStore.get(GUEST_COOKIE_NAME)?.value;
    if (stored && stored.trim().length > 0) {
      return sanitizeUserId(stored.trim());
    }
  } catch {
    // In some API handler contexts, cookies() might not be available or already resolved
  }

  // 4. Generate a new guest session
  return generateGuestId();
}

export function generateGuestId(): string {
  const randomPart = Math.random().toString(36).substring(2, 12);
  const timePart = Date.now().toString(36);
  return `guest_${timePart}_${randomPart}`;
}

export function attachSessionCookie(response: NextResponse, userId: string): NextResponse {
  response.cookies.set({
    name: GUEST_COOKIE_NAME,
    value: userId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return response;
}

function sanitizeUserId(id: string): string {
  // Allow only alphanumeric, dashes, and underscores
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
}
