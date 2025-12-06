import { api } from "./api";

export const sellerService = {
  // Profile
  getMe: () => api.get("/seller/me"),
  updateMe: (data: any) => api.put("/seller/me", data),

  // Products
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.postForm("/uploads/image", formData);
  },
  createProduct: (data: any) => api.post("/seller/products", data),
  getMyProducts: () => api.get("/seller/products"),
  getProductById: (id: number) => api.get(`/seller/products/${id}`),
  updateProduct: (id: number, data: any) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/seller/products/${id}`),

  // Orders
  getSellerOrders: () => api.get("/seller/orders"),
  updateOrderStatus: (id: number, status: string) => api.put(`/seller/orders/${id}/status`, { status }),

  // Dashboard
  getDashboard: () => api.get("/seller/dashboard"),
};