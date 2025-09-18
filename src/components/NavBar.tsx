// src/components/NavBar.tsx
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./logoutButton";

export default async function NavBar() {
  const user = await getCurrentUser();
  return (
    <nav className="w-full border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold">📚 Books</Link>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user.email}</span>
          <Link href="/profile" className="underline">Profile</Link>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link className="underline" href="/auth/login">Login</Link>
          <Link className="underline" href="/auth/register">Register</Link>
        </div>
      )}
    </nav>
  );
}
