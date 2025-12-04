'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/auth.context';
import AuthGuard from '../../components/common/auth-guard';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentProducts: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get seller's products
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const sellerProducts = productsData.products.filter((p: any) => p.sellerId === user?.id);

        setStats({
          totalProducts: sellerProducts.length,
          totalOrders: 0, // Would need orders API for seller
          totalRevenue: sellerProducts.reduce((sum: number, p: any) => sum + p.price, 0),
          recentProducts: sellerProducts.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard sellerOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage your products and track your sales.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    href="/dashboard/products/new"
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Add New Product</p>
                      <p className="text-sm text-gray-600">Create a new listing</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/products"
                    className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Manage Products</p>
                      <p className="text-sm text-gray-600">Edit or delete listings</p>
                    </div>
                  </Link>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">View Analytics</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
                  <Link
                    href="/dashboard/products"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {stats.recentProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first product.</p>
                    <div className="mt-6">
                      <Link
                        href="/dashboard/products/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Product
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-600">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}