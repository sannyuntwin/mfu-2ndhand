"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/common/product-card";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getAll(),
          productService.getAll(), // or getFeatured()
        ]);

        setCategories(catRes);
        setFeaturedProducts(prodRes.slice(0, 8)); // first 8 products as featured
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SAME HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Marketplace</h1>
          <p className="text-xl mb-4 opacity-90">Find amazing products from trusted sellers worldwide</p>
          <Link
            href="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
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
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5..." />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-2 text-gray-500">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
