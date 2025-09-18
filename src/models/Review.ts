// src/models/Review.ts
import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const ReviewSchema = new Schema(
  {
    bookId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 }, // <-- necesario para review?.votes
  },
  { timestamps: true }
);

export type ReviewDoc = InferSchemaType<typeof ReviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Review as Model<ReviewDoc>) ||
  mongoose.model<ReviewDoc>("Review", ReviewSchema);
