// src/components/RegisterForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // opcional: loguear directo o redirigir al login
      router.push("/login");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error ?? "No se pudo registrar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-10 space-y-3">
      <h1 className="text-xl font-semibold">Crear cuenta</h1>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        required
        minLength={6}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="w-full border px-3 py-2 rounded"
      />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full border rounded px-3 py-2"
      >
        {loading ? "Creando..." : "Registrarme"}
      </button>
    </form>
  );
}
