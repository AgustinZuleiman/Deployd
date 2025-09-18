// src/components/logoutButton.tsx
"use client";
export default function LogoutButton() {
  return (
    <button
      className="underline"
      onClick={async () => { await fetch("/api/auth/logout",{method:"POST"}); window.location.href="/"; }}
    >
      Logout
    </button>
  );
}
