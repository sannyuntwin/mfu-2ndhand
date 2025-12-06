export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    title: string
  }
}

export interface Order {
  id: number
  buyerId: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  totalAmount: number
  createdAt: string
  buyer: {
    id: number
    name: string
  }
  items: OrderItem[]
}