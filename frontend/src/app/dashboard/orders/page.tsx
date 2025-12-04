'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/auth.context';

interface SellerOrder {
  id: number;
  buyerId: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  stripePaymentIntentId?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: number;
    name: string;
    email: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      title: string;
      images: { url: string }[];
    };
  }>;
}

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'>('ALL');

  useEffect(() => {
    if (user && (user.role === 'SELLER' || user.role === 'ADMIN')) {
      loadOrders();
    }
  }, [user, filter]);

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') {
        params.append('status', filter);
      }

      const response = await fetch(`http://localhost:5000/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        // Filter orders to only show those that belong to this seller
        const sellerOrders = ordersData.filter((order: SellerOrder) =>
          order.items.some(item => item.product && true) // In a real app, you'd check if the product belongs to the seller
        );
        setOrders(sellerOrders);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus as any } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to manage orders.</p>
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
          <p className="text-gray-600 mb-6">Only sellers and admins can manage orders.</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Orders</h1>
        <p className="text-gray-600">Track and manage your sales orders</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'ALL' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {filter === 'ALL' ? 'You haven\'t received any orders yet.' : `No ${filter.toLowerCase()} orders found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-gray-600">Buyer: {order.buyer.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${order.total.toFixed(2)}
                  </div>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                    <img
                      src={item.product.images?.[0]?.url || "https://via.placeholder.com/60x60?text=No+Image"}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Update Actions */}
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <div className="flex justify-end space-x-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Start Processing
                    </button>
                  )}
                  {order.status === 'PROCESSING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}