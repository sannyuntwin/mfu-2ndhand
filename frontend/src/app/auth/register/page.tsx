'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterForm } from '@/components/forms';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: { name: string; email: string; password: string; role: string }) => {
    setError("");

    setLoading(true);
    try {
      await register(data);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Shared input styling for glassmorphism inputs
  const inputStyle = "w-full pl-12 pr-4 py-3 border border-white/50 bg-white/80 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-150 sm:text-base shadow-inner";
  const inputIconStyle = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-gray-600">Join MFU 2nd Hand Marketplace</p>
        </div>

        <RegisterForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}