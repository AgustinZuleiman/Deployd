// src/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    setLoading(true);
    await fetch("/auth/logout", { method: "POST" });
    setLoading(false);
    router.refresh(); // re-render server components con estado sin sesión
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-1 rounded border"
    >
      {loading ? "Saliendo..." : "Logout"}
    </button>
  );
}
