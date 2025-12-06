'use client';

import { useAuth } from '@/context/auth.context';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  sellerOnly?: boolean;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, requireAuth = true, sellerOnly, adminOnly }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Please log in to access this page.</div>
      </div>
    );
  }

  if (sellerOnly && user.role !== 'SELLER') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Access denied. Seller account required.</div>
      </div>
    );
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Access denied. Admin account required.</div>
      </div>
    );
  }

  return <>{children}</>;
}