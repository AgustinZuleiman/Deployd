// src/app/api/auth/register/route.ts
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
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const token = signToken({ userId: user._id.toString(), email: user.email });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.headers.set("Set-Cookie", setAuthCookie(token));
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bad Request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
