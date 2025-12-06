import { api } from "./api";

export const buyerService = {
  getProfile: () => api.get("/buyer/me"),
  updateProfile: (data: any) => api.put("/buyer/me", data),

  getMyOrders: () => api.get("/buyer/orders"),
  cancelOrder: (id: number) => api.put(`/buyer/orders/${id}/cancel`, {}),

  // ORDER CHECKOUT
  createOrder: (data: any) => api.post("/buyer/orders", data),
  createOrderFromCart: (data: { cartId: number; shippingAddress?: string }) => 
    api.post("/buyer/orders/from-cart", data),
};
