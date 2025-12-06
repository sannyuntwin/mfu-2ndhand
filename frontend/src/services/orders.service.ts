import { api } from '@/lib/api'

export const ordersService = {
  getMyOrders: () => api.get('/buyer/orders'),

  createOrder: (productId: number, quantity: number, shippingAddress?: string) =>
    api.post('/buyer/orders', { productId, quantity, shippingAddress }),

  cancelOrder: (orderId: number) =>
    api.put(`/buyer/orders/${orderId}/cancel`, {}),

  getSellerOrders: () => api.get('/seller/orders'),

  updateOrderStatus: (orderId: number, status: string) =>
    api.put(`/seller/orders/${orderId}/status`, { status }),
}