import { NextResponse, type NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import { z } from "zod";
import { requireAuth } from "@/lib/withAuth";

const createSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const bookId = searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 });

  await connectToDB();
  const reviews = await Review.find({ bookId }).lean();
  return NextResponse.json(reviews);
}

export const POST = requireAuth(async ({ userId }, req) => {
  await connectToDB();
  const body = await req.json();
  const data = createSchema.parse(body);

  const review = await Review.create({ ...data, userId });
  return NextResponse.json(review, { status: 201 });
});
