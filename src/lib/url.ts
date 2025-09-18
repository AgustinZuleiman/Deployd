// src/lib/url.ts
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

export async function absoluteUrl(path: string, req?: NextRequest): Promise<string> {
  try {
    const h = req?.headers ?? (await headers());
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (host) return new URL(path, `${proto}://${host}`).toString();
  } catch {
    // sin headers(), usamos fallbacks
  }

  const envOrigin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const origin = envOrigin || "http://localhost:3000";
  return new URL(path, origin).toString();
}
