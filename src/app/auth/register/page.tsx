// src/app/auth/register/page.tsx
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <RegisterForm />
    </div>
  );
}
