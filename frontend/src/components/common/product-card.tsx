import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  showSeller?: boolean;
}

export function ProductCard({ product, onAddToCart, showSeller = true }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
              <Tag className="w-3 h-3" />
              {product.category.name}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              href={`/products/${product.id}`}
              className="block w-full text-center px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
            <Link
              href={`/products/${product.id}`}
              className="hover:text-blue-500 transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Seller Info */}
          {showSeller && product.seller && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>{product.seller.name}</span>
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
            
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(product.id)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}