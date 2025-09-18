// src/app/api/users/profile/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/lib/db";
import User from "@/models/Users";
import requireAuth from "@/lib/withAuth";

const schema = z.object({ name: z.string().min(1) });

export const PATCH = requireAuth(async ({ userId }, req) => {
  const { name } = schema.parse(await req.json());
  await connectToDB();
  await User.findByIdAndUpdate(userId, { name });
  return NextResponse.json({ ok: true });
});
