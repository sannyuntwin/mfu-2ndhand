'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckoutForm } from '@/components/forms';
import { buyerService } from '@/services/buyer.service';
import { productService } from '@/services/products.service';
import { useCart } from '@/context/cart.context';
import { Product } from '@/types';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, loading: cartLoading } = useCart();
  
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (productId) {
      productService.getById(Number(productId))
        .then(setSingleProduct)
        .catch(() => router.push('/products'));
    }
  }, [productId, router]);

  const handleSubmit = async (data: { shippingAddress: string }) => {
    setIsProcessing(true);
    try {
      if (cart && cart.items.length > 0) {
        // Cart-based checkout - create order from cart
        const order = await buyerService.createOrderFromCart({
          cartId: cart.id,
          shippingAddress: data.shippingAddress,
        });
        router.push(`/orders/${order.id}/payment`);
      } else if (singleProduct) {
        // Single product checkout
        const order = await buyerService.createOrder({
          productId: singleProduct.id,
          quantity,
          shippingAddress: data.shippingAddress,
        });
        router.push(`/orders/${order.id}/payment`);
      } else {
        throw new Error('No items to checkout');
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err?.response?.data?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  // Handle cart-based checkout
  if (cart && cart.items.length > 0) {
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

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
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.product.imageUrl || "/placeholder.jpg"} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">× ${item.product.price}</span>
                      </div>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

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

  // Handle single product checkout
  if (!singleProduct) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
  }

  const total = singleProduct.price * quantity;

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
                  <img src={singleProduct.imageUrl || "/placeholder.jpg"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{singleProduct.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Qty: {quantity}</span>
                    <span className="text-sm text-gray-600">× ${singleProduct.price}</span>
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
