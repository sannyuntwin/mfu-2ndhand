export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}