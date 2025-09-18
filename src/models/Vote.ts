// src/models/Vote.ts
import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const VoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, index: true },
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: true, index: true },
    value: { type: Number, enum: [-1, 1], required: true },
  },
  { timestamps: true }
);

// 1 voto por usuario por review
VoteSchema.index({ userId: 1, reviewId: 1 }, { unique: true });

export type VoteDoc = InferSchemaType<typeof VoteSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Vote as Model<VoteDoc>) ||
  mongoose.model<VoteDoc>("Vote", VoteSchema);
