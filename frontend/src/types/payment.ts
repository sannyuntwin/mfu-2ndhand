export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  stripePaymentIntentId: string;
  stripeClientSecret: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreatePaymentIntentRequest {
  orderId: number;
}