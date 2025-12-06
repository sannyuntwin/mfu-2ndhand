import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
}

export function ProductCard({ product, showSeller = true }: ProductCardProps) {
  const imageUrl = product.imageUrl || "https://via.placeholder.com/300x300?text=No+Image";

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

          <div className="pt-2">
            <span className="text-xl font-bold text-orange-600">
              ${product.price}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}