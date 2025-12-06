'use client';

import { useEffect, useState } from "react";
import { ProductCard } from "../components/common/product-card";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { ShoppingBag, ArrowRight, Sparkles, TrendingUp, Package } from 'lucide-react';

const Link = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <a href={href} className={className}>{children}</a>
);

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [catRes, prodRes] = await Promise.all([
                    categoryService.getAll(),
                    productService.getAll(),
                ]);

                setCategories(catRes);
                setFeaturedProducts(prodRes.slice(0, 8));
            } catch (err) {
                console.error("Failed to load homepage data:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* MODERN HERO SECTION */}
                <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-8 md:p-16 mb-16 overflow-hidden shadow-2xl">
                    
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">Trusted Marketplace</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                            Discover Amazing Pre-Loved Products
                        </h1>
                        <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                            Connect with trusted sellers, find unique second-hand treasures, and give items a new life in our vibrant marketplace community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-xl"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Browse Products
                            </Link>
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                            >
                                Start Selling
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Package className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">1000+</div>
                                <div className="text-sm text-gray-600">Active Listings</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <ShoppingBag className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">500+</div>
                                <div className="text-sm text-gray-600">Happy Buyers</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <TrendingUp className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">98%</div>
                                <div className="text-sm text-gray-600">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED CATEGORIES SECTION */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
                            <p className="text-gray-600">Find what you're looking for</p>
                        </div>
                        <Link 
                            href="/products" 
                            className="text-blue-500 hover:text-blue-600 font-semibold transition-colors inline-flex items-center gap-1"
                        >
                            View all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.id}`}
                                    className="group p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Browse collection</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* FEATURED PRODUCTS SECTION */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                            <p className="text-gray-600">Handpicked items just for you</p>
                        </div>
                        <Link 
                            href="/products" 
                            className="text-blue-500 hover:text-blue-600 font-semibold transition-colors inline-flex items-center gap-1"
                        >
                            See all
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-xl"></div>
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-gray-100 rounded-full">
                                    <Package className="w-16 h-16 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
                            <p className="text-gray-500">Check back soon for amazing finds!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
                
                {/* CALL TO ACTION BANNER */}
                <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-10 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-white">
                            <h3 className="text-3xl font-bold mb-2">Ready to Start Selling?</h3>
                            <p className="text-lg text-blue-100">Join our community and turn your items into income</p>
                        </div>
                        <Link
                            href="/auth/register"
                            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}