import { NextResponse, type NextRequest } from "next/server";
import { readAuthFromRequest, verifyToken, type AuthContext } from "./auth";

type Handler = (ctx: AuthContext, req: NextRequest) => Promise<Response>;

export function requireAuth(handler: Handler) {
  return async (req: NextRequest): Promise<Response> => {
    const token = readAuthFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(payload, req);
  };
}
