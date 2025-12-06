'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { buyerService } from '@/services/buyer.service';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    images: { url: string }[];
  };
}

interface CartContextType {
  cart: CartItem[] | null;
  addToCart: (productId: number, product: any, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cart not implemented in MVP - initialize empty
  useEffect(() => {
    setCart([]);
    setIsLoaded(true);
  }, []);

  const addToCart = async (productId: number, product: any, quantity: number = 1) => {
    // Cart not implemented in MVP
    console.warn('Cart functionality not implemented in MVP');
    alert('Cart not available in MVP - use direct ordering instead');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Note: Backend doesn't have update quantity endpoint, so this is not implemented
    console.warn('Update quantity not implemented in backend');
  };

  const removeFromCart = async (productId: number) => {
    // Cart not implemented in MVP
    console.warn('Cart functionality not implemented in MVP');
  };

  const clearCart = () => {
    // Not implemented, as backend doesn't have clear cart
    console.warn('Clear cart not implemented');
  };

  const getTotal = () => {
    if (!cart) return 0;
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}