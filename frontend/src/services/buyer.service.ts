import { api } from "./api";

export const buyerService = {
  getProfile: () => api.get("/buyer/me"),
  updateProfile: (data: any) => api.put("/buyer/me", data),

  getMyOrders: () => api.get("/buyer/orders"),
  cancelOrder: (id: number) => api.put(`/buyer/orders/${id}/cancel`, {}),

  // CART
  getCart: () => api.get("/buyer/carts"),
  addToCart: (productId: number, quantity: number) =>
    api.post("/buyer/carts", { productId, quantity }),
  removeFromCart: (itemId: number) =>
    api.delete(`/buyer/cart/${itemId}`),

  // ORDER CHECKOUT
  createOrder: (data: any) => api.post("/buyer/orders", data),

  // PAYMENT
  createPaymentLink: (data: { orderId: number, chargeId?: string, qrString?: string }) => api.post("/payments/create-intent", data),
  createQR: (data: { amount: number }) => api.post("/payments/create-qr", data),
};
