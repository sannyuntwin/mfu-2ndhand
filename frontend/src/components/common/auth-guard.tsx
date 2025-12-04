'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth.context';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  sellerOnly?: boolean;
  adminOnly?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = '/auth/login',
  sellerOnly = false,
  adminOnly = false
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login if authentication is required but user is not logged in
        router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (sellerOnly && user?.role !== 'SELLER') {
        // Redirect buyers away from seller-only pages
        router.push('/products');
        return;
      }
    }
  }, [user, loading, requireAuth, sellerOnly, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return null;
  }

  // Don't render children if seller access is required but user is not a seller
  if (sellerOnly && user?.role !== 'SELLER') {
    return null;
  }

  return <>{children}</>;
}

export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}