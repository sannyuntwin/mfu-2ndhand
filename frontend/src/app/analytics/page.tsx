'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth.context';

interface AnalyticsData {
  totalProducts: number;
  activeProducts: number;
  totalSales: number;
  totalRevenue: number;
  monthlyRevenue: number;
  monthlySales: number;
  recentOrders: Array<{
    orderId: number;
    productTitle: string;
    price: number;
    date: string;
    status: string;
  }>;
}

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && (user.role === 'SELLER' || user.role === 'ADMIN')) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Failed to load analytics');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view analytics.</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only sellers and admins can view analytics.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadAnalytics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600">Analytics data is not available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Analytics</h1>
        <p className="text-gray-600">Track your sales performance and product metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold">${analytics.monthlyRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Sales</span>
              <span className="font-semibold">{analytics.monthlySales}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              href="/dashboard/products/new"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700"
            >
              Add New Product
            </Link>
            <Link
              href="/dashboard/products"
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded text-center hover:bg-gray-700"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
        {analytics.recentOrders.length === 0 ? (
          <p className="text-gray-600">No recent sales to display</p>
        ) : (
          <div className="space-y-4">
            {analytics.recentOrders.map((order) => (
              <div key={`${order.orderId}-${order.productTitle}`} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{order.productTitle}</p>
                  <p className="text-sm text-gray-600">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.price}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}