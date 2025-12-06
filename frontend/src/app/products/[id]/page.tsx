import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/services/product.service";
import { AddToCartButton } from "@/components/common/add-to-cart-button";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Calendar, 
  Tag, 
  Package, 
  Shield,
  Star,
  MessageCircle,
  ChevronRight
} from "lucide-react";

async function getProduct(id: string) {
  try {
    const product = await productService.getById(Number(id));
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(categoryId?: number) {
  if (!categoryId) return [];
  try {
    const params = { limit: '4', category: categoryId.toString() };
    const response = await productService.getAll(params);
    return response.products || [];
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

  const relatedProducts = await getRelatedProducts(product.categoryId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-blue-500 transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-lg">
              <Image
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((image: { url: string }, index: number) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity border border-gray-200">
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  <Tag className="w-4 h-4" />
                  {product.category?.name || "Uncategorized"}
                </span>
                {product.seller?.role === "SELLER" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Verified Seller
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              <span className="text-gray-500 line-through text-xl">${(product.price * 1.5).toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <AddToCartButton productId={product.id} />
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all font-medium">
                <Heart className="w-5 h-5" />
                Save
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Seller Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.seller?.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
                    View Profile
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>

            {/* Product Meta */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">Condition</span>
                  <p className="text-gray-900 font-medium">Used - Good</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">Listed</span>
                  <p className="text-gray-900 font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-gray-900 font-medium">Local pickup</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">Views</span>
                  <p className="text-gray-900 font-medium">124 views</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Related */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
                <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                  Write a Review
                </button>
              </div>
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to review this product!</p>
              </div>
            </div>
          </div>

          {/* Related Products Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Products</h3>
            <div className="space-y-4">
              {relatedProducts
                .filter((p: any) => p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct: any) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
                  >
                    <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={relatedProduct.images?.[0]?.url || "/placeholder-product.jpg"}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
                      {relatedProduct.title}
                    </h4>
                    <p className="text-lg font-bold text-gray-900">${relatedProduct.price}</p>
                    {relatedProduct.category && (
                      <p className="text-xs text-gray-500 mt-1">{relatedProduct.category.name}</p>
                    )}
                  </Link>
                ))}
              
              {relatedProducts.filter((p: any) => p.id !== product.id).length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No related products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}