"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart.context";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  seller?: {
    id: number;
    name: string;
    role?: string;
    createdAt?: string;
  };
  createdAt: string;
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Unwrap params Promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      if (!resolvedParams?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch main product
        const productResponse = await fetch(`http://localhost:5000/api/v1/products/${resolvedParams.id}`);
        if (!productResponse.ok) {
          throw new Error('Product not found');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        // Fetch related products
        const relatedResponse = await fetch('http://localhost:5000/api/v1/products');
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (resolvedParams?.id) {
      fetchProduct();
    }
  }, [resolvedParams?.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Please log in to add items to cart.');
      window.location.href = '/login';
      return;
    }
    
    // Check stock availability
    if (product.stock === 0) {
      alert('This product is out of stock.');
      return;
    }
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, 1); // Always add 1 item
      alert(`Added ${product.title} to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to add item to cart. Please try again.';
      alert(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Direct checkout with 1 item
    window.location.href = `/checkout?productId=${product.id}&quantity=1`;
  };

  if (isLoading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/products'}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.jpg";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Product</Badge>
                {product.seller?.role === "SELLER" && (
                  <Badge variant="outline">Verified Seller</Badge>
                )}
              </div>
            </div>

            <div className="text-3xl font-bold text-orange-600">฿{product.price}</div>

            {/* Stock Info */}
            <div className="text-sm text-gray-600">
              {product.stock === 0 ? (
                <span className="text-red-600">Out of Stock</span>
              ) : (
                <span>{product.stock || '∞'} available</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || (product.stock === 0)}
                variant="outline"
                className="flex-1"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Buy Now
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{product.seller?.name}</p>
                <p className="text-sm text-gray-600">
                  Member since 2024
                </p>
                <Button variant="link" className="p-0 h-auto text-orange-600">
                  View Seller Profile
                </Button>
              </CardContent>
            </Card>

            {/* Product Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Listed:</span>
                  <p className="text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this product!
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Products */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Related Products</h3>
            <div className="space-y-4">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct) => (
                  <div 
                    key={relatedProduct.id} 
                    className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => window.location.href = `/products/${relatedProduct.id}`}
                  >
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={relatedProduct.imageUrl || "/placeholder-product.jpg"}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedProduct.title}</h4>
                    <p className="text-orange-600 font-bold">฿{relatedProduct.price}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
