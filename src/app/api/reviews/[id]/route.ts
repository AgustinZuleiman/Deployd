// src/app/api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import requireAuth from "@/lib/withAuth";

const updateSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  content: z.string().min(1).optional(),
});

export const PATCH = requireAuth(async ({ userId }, req) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop()!;
  const body = await req.json();
  const data = updateSchema.parse(body);

  await connectToDB();
  const review = await Review.findById(id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (review.userId.toString() !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  Object.assign(review, data, { updatedAt: new Date() });
  await review.save();
  return NextResponse.json(review);
});

export const DELETE = requireAuth(async ({ userId }, req) => {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop()!;
  await connectToDB();
  const review = await Review.findById(id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (review.userId.toString() !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await review.deleteOne();
  return NextResponse.json({ ok: true });
});
