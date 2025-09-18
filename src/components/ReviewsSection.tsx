"use client";
import React, { useEffect, useState } from "react";

type Review = {
  _id: string;
  userId: string;
  bookId: string;
  rating: number;
  content: string;
  likes: number;
  dislikes: number;
};

interface Props { bookId: string; }

export default function ReviewsSection({ bookId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  async function load() {
    const r = await fetch(`/api/reviews?bookId=${encodeURIComponent(bookId)}`, { cache: "no-store" });
    const data = await r.json();
    setReviews(data);
  }

  useEffect(() => { load(); }, [bookId]);

  async function addReview() {
    if (!text || rating < 1) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, rating, content: text }),
    });
    if (res.ok) {
      setText(""); setRating(0);
      load();
    } else {
      const e = await res.json();
      alert(e.error ?? "Debes iniciar sesión");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reseñas</h3>

      <div className="flex gap-2">
        <input
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          type="number" min={1} max={5}
          className="border rounded px-2 py-1 w-20"
          placeholder="1-5"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Escribí tu reseña…"
        />
        <button onClick={addReview} className="px-3 py-1 rounded bg-blue-600 text-white">
          Publicar
        </button>
      </div>

      <ul className="space-y-3">
        {reviews.map(r => (
          <li key={r._id} className="border rounded p-3">
            <div className="text-sm text-gray-500">⭐ {r.rating}/5</div>
            <p>{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
