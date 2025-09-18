// src/app/auth/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}
