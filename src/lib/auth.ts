import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import { serialize, parse } from "cookie";
import type { NextRequest } from "next/server";

const JWT_SECRET: Secret = (process.env.JWT_SECRET ?? "dev-secret") as Secret;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN ?? "7d") as any;
const COOKIE_NAME = "auth_token";

type MyJWTPayload = { userId: string; email: string };

// --- firma correcta de sign ---
export function signToken(payload: MyJWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function setAuthCookie(token: string): string {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7d
  });
}

export function clearAuthCookie(): string {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
}

// --- helpers de request/cookies ---
export function readAuthFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function verifyToken(token: string): MyJWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // normalizamos a nuestro tipo
    const userId = (payload as any).userId ?? (payload as any)._id ?? (payload as any).sub;
    const email = (payload as any).email;
    if (!userId || !email) return null;
    return { userId: String(userId), email: String(email) };
  } catch {
    return null;
  }
}

export type AuthContext = MyJWTPayload;
