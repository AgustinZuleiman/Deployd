// src/app/api/users/password/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/Users";
import requireAuth from "@/lib/withAuth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const PATCH = requireAuth(async ({ userId }, req) => {
  const { currentPassword, newPassword } = schema.parse(await req.json());
  await connectToDB();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return NextResponse.json({ ok: true });
});
