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

  // ===============================
  // SUBMIT ORDER USING REAL API
  // ===============================
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1️⃣ Create order
      const orderRes = await buyerService.createOrder({
        shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}, ${shippingAddress.country}`,
      });

      const order = orderRes;
      console.log("ORDER CREATED:", order);

      if (!order || !order.id) {
        throw new Error("Failed to create order");
      }

      // 2️⃣ Create payment link
      const paymentLink = await buyerService.createPaymentLink(order.id);
      console.log("PAYMENT LINK:", paymentLink);
      setQrString(paymentLink.qr_string);

      // 3️⃣ Clear cart
      clearCart();

      // 4️⃣ Mark order as placed
      setHasPlacedOrder(true);
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err?.response?.data?.message || "Failed to place order.");
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
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <p className="text-gray-600">No items in cart. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* --------------------
              ORDER SUMMARY
          --------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 py-2 border-b">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product.images?.[0]?.url ? (
                      <img src={item.product.images[0].url} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full bg-gray-300" />}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.title}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>

                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
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

          {/* --------------------
              SHIPPING + PLACE ORDER
          --------------------- */}
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">

                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={shippingAddress.street}
                      onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={shippingAddress.city}
                        onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={shippingAddress.state}
                        onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ZIP Code</Label>
                      <Input
                        value={shippingAddress.zipCode}
                        onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Input
                        value={shippingAddress.country}
                        onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    Confirm Order
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                {qrString ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Scan the QR code with your bank's mobile app to complete payment</p>
                      <div className="flex justify-center">
                        <QRCode value={qrString} size={192} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p>Payment QR will be generated after order placement</p>
                    <p className="text-sm">Scan the QR code with your bank app to complete payment</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
}
