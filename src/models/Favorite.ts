import { Schema, models, model, Types } from "mongoose";

const FavoriteSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
  bookId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});
FavoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default models.Favorite || model("Favorite", FavoriteSchema);
