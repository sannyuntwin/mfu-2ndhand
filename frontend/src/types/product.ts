export interface Product {
  id: number
  title: string
  description: string
  price: number
  imageUrl?: string
  sellerId: number
  isActive: boolean
  createdAt: string
  seller: {
    id: number
    name: string
  }
}