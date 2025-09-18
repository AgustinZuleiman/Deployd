// src/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import requireAuth from "@/lib/withAuth";

const bodySchema = z.object({ bookId: z.string().min(1) });

// GET lista del usuario
export const GET = requireAuth(async ({ userId }) => {
  await connectToDB();
  const favs = await Favorite.find({ userId }).lean();
  return NextResponse.json(favs);
});

// POST add
export const POST = requireAuth(async ({ userId }, req) => {
  const { bookId } = bodySchema.parse(await req.json());
  await connectToDB();
  await Favorite.updateOne({ userId, bookId }, { $set: { userId, bookId } }, { upsert: true });
  return NextResponse.json({ ok: true }, { status: 201 });
});

// DELETE remove ?bookId=xxx
export const DELETE = requireAuth(async ({ userId }, req) => {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 });
  await connectToDB();
  await Favorite.deleteOne({ userId, bookId });
  return NextResponse.json({ ok: true });
});
