'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/cart.context';
import { buyerService } from '@/services/buyer.service';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { ShoppingBag, MapPin, CreditCard, Truck, CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [qrString, setQrString] = useState<string | null>(null);
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Redirect if empty
  useEffect(() => {
    if (cart && cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  // Generate QR on page load
  useEffect(() => {
    if (cart && cart.length > 0 && !qrString && !hasPlacedOrder) {
      handleGenerateQR();
    }
  }, [cart, qrString, hasPlacedOrder]);

  const handleGenerateQR = async () => {
    if (hasPlacedOrder) return;
    setIsProcessing(true);
    try {
      const total = getTotal();
      const qrData = await buyerService.createQR({ amount: total });
      setQrString(qrData.qr_string);
      setChargeId(qrData.chargeId);
      setHasPlacedOrder(true);
    } catch (err: any) {
      console.error("QR generation error:", err);
      alert(err?.response?.data?.message || "Failed to generate QR.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOrder = async () => {
    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.zipCode || !shippingAddress.country) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const order = await buyerService.createOrder({
        shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}`,
      });
      // Create payment record
      await buyerService.createPaymentLink({ orderId: order.id, chargeId: chargeId!, qrString: qrString! });
      clearCart();
      router.push('/orders');
    } catch (err: any) {
      console.error("Order confirmation error:", err);
      alert(err?.response?.data?.message || "Failed to confirm order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">No items in cart. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-blue-500" />
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-sm font-medium text-gray-900">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-blue-500 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
                <MapPin size={20} />
              </div>
              <span className="text-sm font-medium text-gray-900">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2">
                <CreditCard size={20} />
              </div>
              <span className="text-sm font-medium text-gray-600">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <MapPin className="text-blue-500" size={24} />
                  Shipping Information
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">

                  <div>
                    <Label className="text-gray-700 font-medium">Street Address</Label>
                    <Input
                      value={shippingAddress.street}
                      onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">City</Label>
                      <Input
                        value={shippingAddress.city}
                        onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">State</Label>
                      <Input
                        value={shippingAddress.state}
                        onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">ZIP Code</Label>
                      <Input
                        value={shippingAddress.zipCode}
                        onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">Country</Label>
                      <Input
                        value={shippingAddress.country}
                        onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={isProcessing}
                      className="w-full bg-blue-500 hover:bg-gray-900 text-white transition-colors"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Confirm Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="text-blue-500" size={24} />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {qrString ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="inline-block p-4 bg-white rounded-xl shadow-md">
                        <QRCode value={qrString} size={200} />
                      </div>
                    </div>
                    <div className="max-w-md mx-auto">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Scan with your banking app</p>
                      <p className="text-xs text-gray-500">
                        Use your mobile banking app to scan this QR code and complete the payment securely
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">Payment QR Code</p>
                    <p className="text-sm text-gray-500">
                      QR code will be generated after placing your order
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 shadow-sm sticky top-4">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <ShoppingBag className="text-blue-500" size={24} />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0]?.url ? (
                          <img 
                            src={item.product.images[0].url} 
                            className="w-full h-full object-cover" 
                            alt={item.product.title}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <ShoppingBag className="text-gray-400" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      <span>Shipping</span>
                    </div>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {subtotal > 50 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                      <p className="text-xs text-green-700 font-medium">
                        You've qualified for free shipping!
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300 text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}