'use client';

// USER'S IMPORTS (Preserved as requested)
import { useEffect, useState } from "react";
import { ProductCard } from "../components/common/product-card";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

// Lucide Icons for better visuals
import { ShoppingBag, Users, Zap, Compass, Star, Grid3x3, ArrowRight } from 'lucide-react';

// The local Link function, now named 'Link' which shadows the non-functional Next.js import.
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
                // Using mocked services
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
        <div className="min-h-screen bg-gray-50 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* MODERN HERO SECTION */}
                <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white rounded-3xl p-8 md:p-16 mb-16 relative overflow-hidden shadow-2xl">
                    
                    {/* Abstract background elements */}
                    <div className="absolute inset-0 opacity-10">
                         <Grid3x3 className="w-full h-full text-white/50" />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4">
                            The Marketplace for Pre-Loved Treasures
                        </h1>
                        <p className="text-xl mb-8 opacity-90 font-light">
                            Discover unique second-hand products, connect with trusted sellers, and give items a second life.
                        </p>
                        <Link
                            href="/products"
                            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-yellow-300 transition-all duration-300 inline-flex items-center transform hover:scale-105"
                        >
                            Start Shopping Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </section>

                {/* FEATURED CATEGORIES SECTION (Modernized) */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 pb-1">Explore Collections</h2>
                        <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center">
                            View all categories
                            <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-xl shadow-md"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.id}`}
                                    className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white hover:bg-indigo-50 transition-all duration-300 group flex flex-col items-center text-center transform hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">View unique finds</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* FEATURED PRODUCTS SECTION (Modernized) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-pink-500 pb-1">Featured Finds</h2>
                        <Link href="/products" className="text-pink-600 hover:text-pink-800 font-medium transition-colors inline-flex items-center">
                            See all products
                            <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-xl shadow-md"></div>
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-md">
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Featured Products</h3>
                            <p className="mt-2 text-gray-500">The selection is currently empty. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
                
                {/* Call to Action Banner (New Addition) */}
                <section className="mt-16 bg-indigo-500 rounded-3xl p-10 shadow-xl flex flex-col md:flex-row items-center justify-between text-white">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-3xl font-extrabold mb-2">Want to Sell Your Own Items?</h3>
                        <p className="text-lg opacity-90">It's quick, easy, and free to get started.</p>
                    </div>
                    <Link
                        href="/auth/register"
                        className="bg-pink-400 text-gray-900 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-pink-300 transition-all duration-300 inline-flex items-center transform hover:scale-105"
                    >
                        Register as Seller
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </section>

            </main>
        </div>
    );
}