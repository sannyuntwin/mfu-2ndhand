'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/cart.context';
import { useAuth } from '@/context/auth.context';

interface OrderData {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      title: string;
      price: number;
      images: { url: string }[];
    };
  }[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Redirect if no items in cart
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}`,
        }),
      });

      if (response.ok) {
        const order: OrderData = await response.json();
        clearCart(); // Clear cart after successful order
        alert(`Order placed successfully! Order ID: #${order.id}`);
        router.push(`/orders/${order.id}`);
      } else {
        const error = await response.json();
        alert(`Failed to place order: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">No items in cart. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-2 border-b border-gray-200 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.title}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          placeholder="10001"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="United States"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      size="lg"
                    >
                      {isProcessing ? 'Processing Order...' : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p>Demo: Payment processing not implemented</p>
                  <p className="text-sm">Order will be created for testing purposes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}