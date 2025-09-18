import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type IUser = {
  _id: string;
  email: string;
  passwordHash: string;
};

export default models.User || model("User", UserSchema);
