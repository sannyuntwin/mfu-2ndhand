import { api } from "./api";

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreatePaymentIntentRequest {
  orderId: number;
}

export const paymentsService = {
  // Create payment intent for Stripe
  createPaymentIntent: (orderId: number): Promise<PaymentIntentResponse> =>
    api.post("/payments/create-intent", { orderId }),

  // Handle Stripe webhook (for server-side use)
  handleWebhook: (signature: string, body: string) =>
    api.post("/payments/webhook", { signature, body }),

  // Create QR payment (not used with Stripe but keeping for compatibility)
  createQR: (amount: number) =>
    api.post("/payments/create-qr", { amount }),
};