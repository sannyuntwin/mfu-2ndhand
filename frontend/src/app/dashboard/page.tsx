'use client';

// Timestamp: 2025-12-09 - Refresh file modification time
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth.context';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Star,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: number;
    total: number;
    status: string;
    createdAt: string;
    buyer: {
      name: string;
    };
  }>;
  // Mock additional data for better visualization
  monthlyRevenue: number[];
  orderTrends: number[];
  topProducts: Array<{
    id: number;
    title: string;
    sales: number;
    revenue: number;
  }>;
  customerSatisfaction: number;
  responseTime: string;
}

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (user && user.role === 'SELLER') {
      loadDashboardStats();
    }
  }, [user, selectedPeriod]);

  const loadDashboardStats = async () => {
    try {
      // Mock data for demonstration
      const mockStats: SellerStats = {
        totalProducts: 24,
        totalOrders: 156,
        totalRevenue: 8420.50,
        recentOrders: [
          {
            id: 1001,
            total: 299.99,
            status: 'COMPLETED',
            createdAt: '2024-01-15T10:30:00Z',
            buyer: { name: 'John Doe' }
          },
          {
            id: 1002,
            total: 149.50,
            status: 'PENDING',
            createdAt: '2024-01-15T09:15:00Z',
            buyer: { name: 'Jane Smith' }
          },
          {
            id: 1003,
            total: 89.99,
            status: 'SHIPPED',
            createdAt: '2024-01-14T16:45:00Z',
            buyer: { name: 'Mike Johnson' }
          }
        ],
        // Mock trend data
        monthlyRevenue: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
        orderTrends: [12, 19, 15, 25, 22, 30, 28],
        topProducts: [
          { id: 1, title: 'Vintage Camera', sales: 12, revenue: 1800 },
          { id: 2, title: 'Designer Handbag', sales: 8, revenue: 1200 },
          { id: 3, title: 'Classic Watch', sales: 6, revenue: 900 },
        ],
        customerSatisfaction: 4.8,
        responseTime: '2.3h'
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in as a seller to access this page.</p>
          <Link
            href="/auth/login"
            className="btn-primary px-6 py-3"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only sellers can access this dashboard.</p>
          <Link
            href="/"
            className="btn-primary px-6 py-3"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const revenueGrowth = 12.5; // Mock growth percentage
  const ordersGrowth = 8.3;
  const productsGrowth = 16.7;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your store today.</p>
            </div>
            
            {/* Time Period Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ฿{stats?.totalRevenue.toLocaleString() || '0'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {revenueGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueGrowth)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalOrders.toLocaleString() || '0'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {ordersGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(ordersGrowth)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalProducts || '0'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {productsGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${productsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(productsGrowth)}%
                  </span>
                  <span className="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.customerSatisfaction || '0'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-500">Average rating</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {stats?.monthlyRevenue.map((revenue, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg min-h-[20px] relative group"
                    style={{ height: `${(revenue / Math.max(...stats.monthlyRevenue)) * 200}px` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      ฿{revenue}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Trends</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {stats?.orderTrends.map((orders, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-secondary-500 to-secondary-400 rounded-t-lg min-h-[20px] relative group"
                    style={{ height: `${(orders / Math.max(...stats.orderTrends)) * 200}px` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {orders} orders
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  href="/dashboard/products/new"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-sm opacity-90">List an item for sale</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </Link>
                
                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Manage Products</p>
                    <p className="text-sm text-gray-600">Edit your listings</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </Link>
                
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-600">Manage your sales</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link 
                  href="/dashboard/orders"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">#{order.id}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">by {order.buyer.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">฿{order.total.toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'COMPLETED' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}