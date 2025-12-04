'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProductCard } from '../components/common/product-card';

export default function Home() {
  const [loading] = useState(false);

  // For now, dummy data, later fetch from API
  const featuredProducts = [
    {
      id: 1,
      title: 'Sample Product 1',
      description: 'Great product',
      price: 29.99,
      sellerId: 1,
      createdAt: '2023-01-01T00:00:00.000Z',
      seller: { id: 1, name: 'Seller1', email: 'seller1@example.com', role: 'SELLER' as const, createdAt: '2023-01-01T00:00:00.000Z' },
      images: [{ id: 1, url: '/placeholder.jpg', productId: 1, createdAt: '2023-01-01T00:00:00.000Z' }],
      reviews: []
    },
    // Add more dummy products
  ];

  const categories = [
    { id: 1, name: 'Electronics', description: undefined },
    { id: 2, name: 'Clothing', description: undefined },
    { id: 3, name: 'Books', description: undefined },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Marketplace</h1>
          <p className="text-xl mb-4 opacity-90">Find amazing products from trusted sellers worldwide</p>
          <Link href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
            Shop Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map(category => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 003.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-2 text-gray-500">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start selling?</h2>
        <p className="text-xl mb-6 opacity-90">Join thousands of sellers on our marketplace</p>
        <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
          Become a Seller
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
