import { api } from "./api";

export const adminService = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Users
  getUsers: () => api.get("/admin/users"),
  createUser: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/admin/users", data),
  updateUserRole: (userId: number, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),

  // Products
  getProducts: () => api.get("/admin/products"),
  createProduct: (data: { title: string; description: string; price: number; imageUrl?: string; sellerId: number }) =>
    api.post("/admin/products", data),
  deleteProduct: (productId: number) => api.delete(`/admin/products/${productId}`),

  // Orders
  getOrders: () => api.get("/admin/orders"),
  createOrder: (data: { buyerId: number; totalAmount: number; items: { productId: number; quantity: number; price: number }[] }) =>
    api.post("/admin/orders", data),
  updateOrderStatus: (orderId: number, status: string) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId: number) => api.put(`/admin/orders/${orderId}/cancel`, {}),
};