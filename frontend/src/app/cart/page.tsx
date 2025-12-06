'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart.context';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, getTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const safeCart = Array.isArray(cart) ? cart : [];

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-1 2M17 13l1 2M15 18h-5a2 2 0 01-2-2v-1a2 2 0 012-2h5a2 2 0 012 2v1a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{safeCart.length} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {safeCart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      
                      {/* IMAGE */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.images?.[0]?.url ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          <Link href={`/products/${item.productId}`} className="hover:text-orange-600">
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">${item.product.price.toFixed(2)}</p>
                      </div>

                      {/* QUANTITY — DISABLED */}
                      <div className="flex items-center space-x-2 opacity-40 cursor-not-allowed">
                        <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">
                          -
                        </div>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">
                          +
                        </div>
                      </div>

                      {/* TOTAL */}
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">Clear Cart</Button>
                  <Link href="/products">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${(getTotal() * 0.08).toFixed(2)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(getTotal() * 1.08).toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
