'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckoutForm } from '@/components/forms';
import { buyerService } from '@/services/buyer.service';
import { productService } from '@/services/products.service';
import { Product } from '@/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (productId) {
      productService.getById(Number(productId))
        .then(setProduct)
        .catch(() => router.push('/products'));
    }
  }, [productId, router]);

  const handleSubmit = async (data: { shippingAddress: string }) => {
    if (!product) return;

    setIsProcessing(true);
    try {
      const order = await buyerService.createOrder({
        productId: product.id,
        quantity,
        shippingAddress: data.shippingAddress,
      });

      router.push('/orders');
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err?.response?.data?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
  }

  const total = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 py-2 border-b">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={product.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16"
                    />
                    <span className="text-sm text-gray-600">× ${product.price}</span>
                  </div>
                </div>
                <p className="font-medium">${total.toFixed(2)}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm onSubmit={handleSubmit} loading={isProcessing} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
