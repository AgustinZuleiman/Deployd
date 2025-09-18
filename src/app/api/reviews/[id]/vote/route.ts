// src/app/api/reviews/[id]/vote/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import Vote from "@/models/Vote";
import requireAuth from "@/lib/withAuth";

const schema = z.object({ value: z.number().min(-1).max(1) });

export const POST = requireAuth(async ({ userId }, req) => {
  const pathname = new URL(req.url).pathname;          // .../reviews/:id/vote
  const reviewId = pathname.split("/").slice(-2, -1)[0];

  const { value } = schema.parse(await req.json());

  await connectToDB();

  // upsert del voto
  const prev = await Vote.findOne({ userId, reviewId });
  if (!prev) {
    await Vote.create({ userId, reviewId, value });
    await Review.findByIdAndUpdate(reviewId, { $inc: { votes: value } });
  } else if (prev.value !== value) {
    await Vote.updateOne({ _id: prev._id }, { value });
    await Review.findByIdAndUpdate(reviewId, { $inc: { votes: value - prev.value } });
  }
  // si es el mismo valor, no cambia

  const review = await Review.findById(reviewId);
  const votes = review?.votes ?? 0;
  return NextResponse.json({ votes });
});
