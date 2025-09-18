// src/lib/withAuth.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readAuthFromRequest, verifyToken, type AuthPayload } from "@/lib/auth";

type Handler = (ctx: AuthPayload, req: NextRequest) => Promise<Response>;

export default function requireAuth(handler: Handler) {
  return async (req: NextRequest) => {
    try {
      const token = readAuthFromRequest(req);
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const payload = verifyToken(token);
      if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return await handler(payload, req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
