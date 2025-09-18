// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/Users";
import { signToken, setAuthCookie } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("Set-Cookie", setAuthCookie(token));
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bad Request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
