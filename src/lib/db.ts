import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

let g = global as GlobalWithMongoose;

export function connectToDB() {
  if (!g._mongooseConn) {
    g._mongooseConn = mongoose.connect(MONGODB_URI, {
      dbName: "booksapp",
    });
  }
  return g._mongooseConn;
}
