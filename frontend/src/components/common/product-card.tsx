import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart.context";

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
  className?: string;
}

export function ProductCard({ product, showSeller = true, className = "" }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const imageUrl = product.imageUrl || "/placeholder.jpg";
  
  // Mock data for demonstration since these properties don't exist in Product type
  const rating = 4.2;
  const reviewCount = Math.floor(Math.random() * 50) + 5;
  const isOnSale = Math.random() > 0.7; // 30% chance of being on sale
  const originalPrice = isOnSale ? product.price * 1.2 : null;
  const stock = Math.floor(Math.random() * 10) + 1; // Mock stock for demo

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 ${className}`}>
      <Link href={`/products/${product.id}`}>
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                SALE
              </span>
            )}
            {stock === 0 && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full shadow-lg">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 bg-white/90 text-gray-600 rounded-full shadow-lg hover:bg-white hover:text-primary-600 transition-all duration-200">
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add to Cart (appears on hover for items in stock) */}
          {stock > 0 && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Seller Info */}
          {showSeller && product.seller && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {product.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-500">{product.seller.name}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{rating}</span>
            </div>
            <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-600">
                ฿{product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ฿{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {stock > 0 && (
              <span className="text-xs text-green-600 font-medium">
                {stock} in stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Loading skeleton component
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="aspect-square bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Grid component with improved layout
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export function ProductGrid({ products, loading = false, className = "" }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria to find what you're looking for.</p>
          <button className="btn-primary">
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}