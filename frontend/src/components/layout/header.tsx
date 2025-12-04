"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth.context';

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Marketplace
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            {user?.role === 'SELLER' && (
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900">
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>

            {loading ? (
              <span>Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.name}</span>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <button onClick={logout} className="text-gray-700 hover:text-gray-900">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}