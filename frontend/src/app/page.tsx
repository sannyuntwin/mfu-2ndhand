'use client';

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/common";
import { productService } from "@/services/products.service";
import { ArrowRight, Shield, Truck, Headphones, Star, Users, Zap, Heart } from 'lucide-react';
import Link from "next/link";

// The local Link function, now named 'Link' which shadows the non-functional Next.js import.
const LinkComponent = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <a href={href} className={className}>{children}</a>
);

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const prodRes = await productService.getAll();
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
                
                {/* MODERN HERO SECTION */}
                <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden">
                    
                    {/* Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Left Column - Main Content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center px-4 py-2 text-orange-500 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
                                    <Star className="w-4 h-4 mr-2 text-yellow-300" />
                                    Thailand's Trusted Marketplace
                                </div>
                                
                                <h1 className="text-4xl md:text-6xl text-orange-500 lg:text-7xl font-bold leading-tight tracking-tight mb-6 animate-slide-up">
                                    Discover 
                                    <span className="block text-orange-500 bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                                        Hidden Treasures
                                    </span>
                                </h1>
                                
                                <p className="text-xl md:text-2xl mb-8 text-orange-500 opacity-90 font-light max-w-2xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                                    Connect with trusted sellers, find unique second-hand items, and give products a second life. 
                                    Start your sustainable shopping journey today.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
                                    <LinkComponent
                                        href="/products"
                                        className="group bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105"
                                    >
                                        Start Shopping
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </LinkComponent>
                                    
                                    <LinkComponent
                                        href="/auth/register"
                                        className="group border-2 bg-orange-500 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center"
                                    >
                                        Become a Seller
                                        <Zap className="ml-2 w-5 h-5" />
                                    </LinkComponent>
                                </div>
                            </div>
                            
                            {/* Right Column - Stats */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/10 text-orange-600 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20">
                                        <div className="text-3xl font-bold mb-2">10K+</div>
                                        <div className="text-sm opacity-80">Happy Customers</div>
                                    </div>
                                    <div className="bg-white/10 text-orange-600 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20">
                                        <div className="text-3xl font-bold mb-2">5K+</div>
                                        <div className="text-sm opacity-80">Products Sold</div>
                                    </div>
                                    <div className="bg-white/10 text-orange-600 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20">
                                        <div className="text-3xl font-bold mb-2">2K+</div>
                                        <div className="text-sm opacity-80">Trusted Sellers</div>
                                    </div>
                                    <div className="bg-white/10 text-orange-600 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20">
                                        <div className="text-3xl font-bold mb-2">98%</div>
                                        <div className="text-sm opacity-80">Satisfaction Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose MFU-2ndHand?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We're revolutionizing second-hand shopping with trust, quality, and convenience at the forefront.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-100 hover:border-primary-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Sellers</h3>
                                <p className="text-gray-600">All sellers go through our verification process to ensure authenticity and reliability.</p>
                            </div>
                            
                            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-100 hover:border-primary-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                                <p className="text-gray-600">Quick and reliable shipping options to get your items to you as fast as possible.</p>
                            </div>
                            
                            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-100 hover:border-primary-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Headphones className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                                <p className="text-gray-600">Our customer support team is always here to help you with any questions or concerns.</p>
                            </div>
                            
                            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-gray-100 hover:border-primary-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Choice</h3>
                                <p className="text-gray-600">Reduce waste and help the environment by giving pre-loved items a new home.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED PRODUCTS SECTION */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
                            <div className="mb-6 lg:mb-0">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Featured Products
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Handpicked treasures from our community
                                </p>
                            </div>
                            <LinkComponent 
                                href="/products" 
                                className="group inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                            >
                                View all products
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </LinkComponent>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        <div className="aspect-square bg-gray-200 animate-pulse"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                            <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : featuredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <Users className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Featured Products</h3>
                                <p className="text-gray-600 mb-6">The selection is currently empty. Check back soon!</p>
                            </div>
                        ) : (
                            <ProductGrid products={featuredProducts} />
                        )}
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-20 bg-gradient-to-r  from-primary-600 to-accent-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl text-orange-600 font-bold mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl mb-8 opacity-90 text-orange-600 max-w-3xl mx-auto">
                            Join thousands of satisfied customers who have found amazing deals and given items a second life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <LinkComponent
                                href="/auth/register"
                                className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105"
                            >
                                Get Started Today
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </LinkComponent>
                            <LinkComponent
                                href="/products"
                                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl bg-orange-600 font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center"
                            >
                                Browse Products
                                <Users className="ml-2 w-5 h-5" />
                            </LinkComponent>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}