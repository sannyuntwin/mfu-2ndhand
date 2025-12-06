"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Package, LayoutDashboard, ShieldCheck } from 'lucide-react';

import { useAuth } from '@/context/auth.context';
import { useCart } from '@/context/cart.context';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-500 transition-colors">
            Marketplace
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-blue-500 font-medium transition-colors">
              Products
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-600 hover:text-blue-500 font-medium transition-colors flex items-center gap-2">
                <Package size={18} />
                Orders
              </Link>
            )}
            {user?.role === 'SELLER' && (
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 font-medium transition-colors flex items-center gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-500 font-medium transition-colors flex items-center gap-2">
                <ShieldCheck size={18} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-500 transition-colors">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {loading ? (
              <span className="text-gray-600">Loading...</span>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Hello, {user.name}</span>
                <Link href="/profile" className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <User size={20} />
                  Profile
                </Link>
                <button 
                  onClick={logout} 
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-500 transition-colors font-medium">
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/cart" className="relative text-gray-600">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 shadow-lg">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              href="/products" 
              className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium"
              onClick={toggleMobileMenu}
            >
              Products
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <Package size={18} />
                Orders
              </Link>
            )}
            {user?.role === 'SELLER' && (
              <Link 
                href="/dashboard" 
                className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin/dashboard" 
                className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <ShieldCheck size={18} />
                Admin Panel
              </Link>
            )}
            
            <div className="border-t border-gray-300 my-2"></div>
            
            {loading ? (
              <span className="block px-4 py-3 text-gray-600">Loading...</span>
            ) : user ? (
              <>
                <div className="px-4 py-2 text-gray-900 font-semibold">
                  Hello, {user.name}
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-medium"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block px-4 py-3 bg-blue-500 text-white hover:bg-gray-900 rounded-lg transition-colors font-medium text-center"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}