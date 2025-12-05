'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from '../../../context/auth.context';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

// Defining the expected data structure for registration
interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "BUYER" | "SELLER";
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Using the mocked useAuth and useRouter
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      router.push("/"); // or redirect to login
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-600 to-red-600 font-sans">
      
      {/* Glassmorphism Card (replacing shadcn Card) */}
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl text-white border border-white/30">
        
        {/* Card Header Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center text-yellow-400 mb-2">
            <UserPlus className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-semibold text-center">
            Create Your Account
          </h1>
          <p className="text-center flex items-center justify-center pt-2 text-white/80 text-sm">
            <ShoppingBag className="w-4 h-4 mr-1 text-yellow-400" />
            Join the SecondHand Marketplace community!
          </p>
        </div>

        {/* Card Content & Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium">
                  <User className="w-4 h-4 mr-1 inline-block align-text-bottom text-yellow-400" />
                  Full Name
                </label>
                <div className="relative">
                    <div className={inputIconStyle}>
                        <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=""
                      className={inputStyle}
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium">
                  <Mail className="w-4 h-4 mr-1 inline-block align-text-bottom text-yellow-400" />
                  Email Address
                </label>
                <div className="relative">
                    <div className={inputIconStyle}>
                        <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=""
                      className={inputStyle}
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  <Lock className="w-4 h-4 mr-1 inline-block align-text-bottom text-yellow-400" />
                  Password
                </label>
                <div className="relative">
                    <div className={inputIconStyle}>
                        <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder=""
                      className={inputStyle}
                    />
                </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1 inline-block align-text-bottom text-yellow-400" />
                  Confirm Password
                </label>
                <div className="relative">
                    <div className={inputIconStyle}>
                        <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder=""
                      className={inputStyle}
                    />
                </div>
            </div>


            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center p-3 text-sm text-white bg-red-600 rounded-xl shadow-lg border border-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button (styled like login button) */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-full text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl disabled:opacity-60 transition duration-300 mt-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-white/30">
            <p className="text-sm text-white/70">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-white hover:text-yellow-400 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}