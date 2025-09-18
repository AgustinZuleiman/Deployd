// src/app/profile/page.tsx
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { absoluteUrl } from "@/lib/url";
import Reviews from "@/models/Review";
import { connectToDB } from "@/lib/db";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  await connectToDB();
  const myReviews = await Reviews.find({ userId: user.userId }).sort({createdAt:-1}).lean();

  async function updateName(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    await fetch(await absoluteUrl("/api/users/profile"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="border p-4 rounded space-y-2">
        <p><strong>User ID:</strong> {user.userId}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <form action={updateName} className="flex gap-2">
          <input name="name" className="px-3 py-2 rounded bg-zinc-900 border border-zinc-700" placeholder="New name"/>
          <button className="bg-blue-600 rounded px-3">Update</button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Mis Reseñas</h2>
        <ul className="space-y-2">
          {myReviews.map((r)=>(
            <li key={r._id.toString()} className="border rounded p-3">
              <div className="text-sm text-gray-400">Book: {r.bookId}</div>
              <div>⭐ {r.rating}</div>
              <div className="whitespace-pre-wrap">{r.content}</div>
              <div className="text-sm text-gray-400">Votes: {r.votes}</div>
            </li>
          ))}
          {!myReviews.length && <div className="text-gray-400">Sin reseñas todavía.</div>}
        </ul>
      </div>
    </div>
  );
}
