// src/lib/db.ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI missing");

let conn: typeof mongoose | null = null;

export async function connectToDB() {
  if (conn) return conn;
  if (mongoose.connection.readyState === 1) return mongoose;
  conn = await mongoose.connect(uri, { dbName: "BooksDB" });
  return conn;
}
