import { api } from "./api";

export const buyerService = {
  getProfile: () => api.get("/buyer/me"),
  updateProfile: (data: any) => api.put("/buyer/me", data),

  getProducts: () => api.get("/buyer/products"),
  getProductDetail: (id: number) => api.get(`/buyer/products/${id}`),

  getOrders: () => api.get("/buyer/orders"),

  // Payment
  createPayment: (data: any) => api.post("/buyer/payment", data),
};
