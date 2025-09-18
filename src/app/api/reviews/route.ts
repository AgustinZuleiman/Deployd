// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import requireAuth from "@/lib/withAuth";

const createSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
});

// GET /api/reviews?bookId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 });
  await connectToDB();
  const reviews = await Review.find({ bookId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(reviews);
}

// POST (auth) crea review
export const POST = requireAuth(async ({ userId }, req) => {
  const body = await req.json();
  const data = createSchema.parse(body);
  await connectToDB();
  const review = await Review.create({ ...data, userId });
  return NextResponse.json(review, { status: 201 });
});
