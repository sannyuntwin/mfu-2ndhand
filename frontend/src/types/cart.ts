export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    title: string
    price: number
    images: { url: string }[]
  }
}

export interface Cart {
  items: CartItem[]
}