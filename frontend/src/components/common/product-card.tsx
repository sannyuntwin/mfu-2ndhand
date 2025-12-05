import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  showSeller?: boolean;
}

export function ProductCard({ product, onAddToCart, showSeller = true }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">
            <Link
              href={`/products/${product.id}`}
              className="hover:text-orange-600 transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {showSeller && product.seller && (
            <p className="text-sm text-gray-500">
              Seller: {product.seller.name}
            </p>
          )}

          {product.category && (
            <p className="text-xs text-gray-400">
              Category: {product.category.name}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-orange-600">
              ${product.price}
            </span>
            {onAddToCart && (
              <Button
                size="sm"
                onClick={() => onAddToCart(product.id)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}