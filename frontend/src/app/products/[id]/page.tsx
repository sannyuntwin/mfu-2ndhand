// Server Component

import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/services/products.service";
import { useCart } from "@/context/cart.context";
import { useState } from "react";

async function getProduct(id: string) {
  try {
    const product = await productService.getById(Number(id));
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts() {
  try {
    const response = await productService.getAll();
    return response?.slice(0, 4) || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts();

  return (
    <ProductPageClient 
      product={product} 
      relatedProducts={relatedProducts} 
    />
  );
}

function ProductPageClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      alert(`Added ${quantity} ${product.title} to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Direct checkout with selected quantity
    window.location.href = `/checkout?productId=${product.id}&quantity=${quantity}`;
  };

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

            <div className="text-3xl font-bold text-orange-600">${product.price}</div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {product.stock || '∞'} available
              </span>
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

            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="text-red-600 font-medium">Out of Stock</div>
            )}

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{product.seller?.name}</p>
                <p className="text-sm text-gray-600">
                  Member since {product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : 'N/A'}
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
                .filter((p: any) => p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct: any) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg p-4 shadow">
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={relatedProduct.imageUrl || "/placeholder-product.jpg"}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedProduct.title}</h4>
                    <p className="text-orange-600 font-bold">${relatedProduct.price}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
