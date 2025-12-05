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

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log('Loading cart from API...');
        const data = await buyerService.getCart();
        console.log('Cart data received:', data);
        // Handle case where cart doesn't exist yet
        if (!data || !data.items) {
          setCart([]);
          return;
        }
        // Transform qty to quantity for frontend
        const transformedCart = data.items.map((item: any) => ({
          ...item,
          quantity: item.qty,
        }));
        console.log('Transformed cart:', transformedCart);
        setCart(transformedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productId: number, product: any, quantity: number = 1) => {
    try {
      await buyerService.addToCart(productId, quantity);
      // Reload cart from API
      const data = await buyerService.getCart();
      if (!data || !data.items) {
        setCart([]);
        return;
      }
      const transformedCart = data.items.map((item: any) => ({
        ...item,
        quantity: item.qty,
      }));
      setCart(transformedCart);
      alert(`Added ${product.title} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Note: Backend doesn't have update quantity endpoint, so this is not implemented
    console.warn('Update quantity not implemented in backend');
  };

  const removeFromCart = async (productId: number) => {
    try {
      // Find item ID from cart
      const item = cart?.find(i => i.productId === productId);
      if (item) {
        await buyerService.removeFromCart(item.id);
        // Reload cart
        const data = await buyerService.getCart();
        if (!data || !data.items) {
          setCart([]);
          return;
        }
        const transformedCart = data.items.map((item: any) => ({
          ...item,
          quantity: item.qty,
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
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