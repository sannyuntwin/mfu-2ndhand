import { api } from "./api";

export interface CartItem {
  id: number;
  quantity: number;
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

export const cartService = {
  // Get user's cart
  getCart: (): Promise<Cart> => api.get("/cart"),

  // Add item to cart
  addItem: (productId: number, quantity: number = 1): Promise<CartItem> =>
    api.post("/cart/items", { productId, quantity }),

  // Update cart item quantity
  updateItem: (productId: number, quantity: number): Promise<CartItem> =>
    api.put(`/cart/items/${productId}`, { quantity }),

  // Remove item from cart
  removeItem: (productId: number): Promise<void> =>
    api.delete(`/cart/items/${productId}`),

  // Clear cart
  clearCart: (): Promise<void> => api.delete("/cart"),
};