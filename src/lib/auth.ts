// src/lib/auth.ts
import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import { serialize } from "cookie";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const JWT_SECRET: Secret = (process.env.JWT_SECRET ?? "dev-secret") as Secret;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
const COOKIE_NAME = "auth_token";

export type AuthPayload = { userId: string; email: string };

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
export function setAuthCookie(token: string): string {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true, path: "/", sameSite: "lax",
    secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7,
  });
}
export function clearAuthCookie(): string {
  return serialize(COOKIE_NAME, "", { httpOnly: true, path: "/", expires: new Date(0) });
}
export function verifyToken(token: string): AuthPayload | null {
  try {
    const p = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = (p as Record<string, unknown>).userId ?? (p as Record<string, unknown>).sub ?? (p as Record<string, unknown>)._id;
    const email = (p as Record<string, unknown>).email;
    if (!userId || !email) return null;
    return { userId: String(userId), email: String(email) };
  } catch { return null; }
}
export function readAuthFromRequest(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}
export async function getCurrentUser(): Promise<AuthPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}
