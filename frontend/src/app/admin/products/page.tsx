'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/auth.context';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  seller: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
  images: { url: string }[];
  _count: {
    reviews: number;
    favorites: number;
    orderItems: number;
  };
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadProducts();
    }
  }, [user, currentPage, filter, search]);

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (filter !== 'ALL') {
        if (filter === 'PENDING') params.append('isApproved', 'false');
        else if (filter === 'APPROVED') params.append('isApproved', 'true');
        else if (filter === 'REJECTED') params.append('isApproved', 'false'); // Rejected products are unapproved
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`http://localhost:5000/admin/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotalPages(Math.ceil(data.total / data.limit));
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/products/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProducts(prev =>
          prev.map(product =>
            product.id === id ? { ...product, isApproved: true } : product
          )
        );
      } else {
        alert('Failed to approve product');
      }
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product');
    }
  };

  const rejectProduct = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/products/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProducts(prev =>
          prev.map(product =>
            product.id === id ? { ...product, isApproved: false } : product
          )
        );
      } else {
        alert('Failed to reject product');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(product => product.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in as an admin.</p>
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

  if (user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only administrators can access this page.</p>
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

  const getStatusBadge = (product: Product) => {
    if (!product.isApproved) {
      return <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
    if (product.isApproved && product.isActive) {
      return <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span>;
    }
    return <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Moderation</h1>
        <p className="text-gray-600">Review and manage product listings</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {filter === 'PENDING' ? 'No products are waiting for approval.' : `No ${filter.toLowerCase()} products found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={product.images?.[0]?.url || "https://via.placeholder.com/80x80?text=No+Image"}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {product.title}
                      </Link>
                      {getStatusBadge(product)}
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Seller: {product.seller.name}</span>
                      <span>Category: {product.category?.name || 'N/A'}</span>
                      <span>Price: ${product.price}</span>
                      <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Reviews: {product._count.reviews}</span>
                      <span>Favorites: {product._count.favorites}</span>
                      <span>Orders: {product._count.orderItems}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {!product.isApproved && (
                    <>
                      <button
                        onClick={() => approveProduct(product.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectProduct(product.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-blue-600 text-white rounded">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}