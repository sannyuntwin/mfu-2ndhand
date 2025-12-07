'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { paymentsService } from '@/services/payments.service';
import { buyerService } from '@/services/buyer.service';

interface Order {
  id: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress?: string;
  payment?: {
    id: number;
    status: string;
    amount: number;
    stripePaymentIntentId?: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    paymentIntentId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orders = await buyerService.getMyOrders();
      const currentOrder = orders.find((o: Order) => o.id === parseInt(orderId));
      
      if (!currentOrder) {
        router.push('/orders');
        return;
      }

      setOrder(currentOrder);

      // If order needs payment, create payment intent
      if (currentOrder.paymentStatus === 'PENDING') {
        const paymentIntent = await paymentsService.createPaymentIntent(currentOrder.id);
        setPaymentData(paymentIntent);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData || !order) return;

    try {
      setProcessing(true);
      
      // In a real implementation, you would use Stripe.js here
      // For now, we'll simulate a successful payment
      alert(`Payment would be processed here with client secret: ${paymentData.clientSecret}`);
      
      // Redirect to order success page or refresh order status
      router.refresh();
      await loadOrder();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 text-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        <Card>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span>฿{order.totalAmount.toFixed(2)}</span>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <span className="text-gray-600">Shipping Address:</span>
                <p className="mt-1 text-gray-900">{order.shippingAddress}</p>
              </div>
            )}

            {/* Payment Section */}
            {order.paymentStatus === 'PENDING' && paymentData && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    Ready to process payment with Stripe. Client Secret: {paymentData.clientSecret.substring(0, 20)}...
                  </p>
                </div>
                <Button 
                  onClick={handlePayment} 
                  disabled={processing}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {processing ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            )}

            {order.paymentStatus === 'PAID' && (
              <div className="border-t pt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">Payment completed successfully!</p>
                  {order.payment?.stripePaymentIntentId && (
                    <p className="text-sm text-green-600 mt-1">
                      Transaction ID: {order.payment.stripePaymentIntentId}
                    </p>
                  )}
                </div>
              </div>
            )}

            {order.paymentStatus === 'FAILED' && (
              <div className="border-t pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">Payment failed. Please try again or contact support.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/orders')}
                className="flex-1"
              >
                Back to Orders
              </Button>
              {order.paymentStatus === 'PAID' && (
                <Button 
                  onClick={() => router.push(`/products`)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Continue Shopping
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}