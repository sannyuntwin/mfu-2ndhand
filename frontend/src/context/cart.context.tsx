'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cartService, type Cart, type CartItem } from '@/services/cart.service';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create an empty cart object with required fields
  const createEmptyCart = (): Cart => ({
    id: 0,
    userId: 0,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        // No token, set empty cart and don't show error
        setCart(createEmptyCart());
        setLoading(false);
        return;
      }
      
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err: any) {
      console.error('Failed to load cart:', err);
      
      // Handle authentication errors gracefully
      if (err?.message?.includes('Unauthorized') || err?.message?.includes('401')) {
        setCart(createEmptyCart()); // Empty cart for unauthenticated users
        setError(null); // Don't show error for unauthenticated users
      } else {
        setError(err?.message || 'Failed to load cart');
        setCart(createEmptyCart()); // Empty cart as fallback
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setError(null);
      const newItem = await cartService.addItem(productId, quantity);
      
      // Update cart state
      setCart(prevCart => {
        if (!prevCart) return { ...createEmptyCart(), items: [newItem] };
        
        const existingItemIndex = prevCart.items.findIndex(item => item.product.id === productId);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevCart.items];
          updatedItems[existingItemIndex] = newItem;
          return { ...prevCart, items: updatedItems };
        } else {
          // Add new item
          return { ...prevCart, items: [...prevCart.items, newItem] };
        }
      });
    } catch (err: any) {
      console.error('Failed to add item to cart:', err);
      setError(err?.response?.data?.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setError(null);
      const updatedItem = await cartService.updateItem(productId, quantity);
      
      // Update cart state
      setCart(prevCart => {
        if (!prevCart) return prevCart;
        
        const updatedItems = prevCart.items.map(item =>
          item.product.id === productId ? updatedItem : item
        );
        return { ...prevCart, items: updatedItems };
      });
    } catch (err: any) {
      console.error('Failed to update item quantity:', err);
      setError(err?.response?.data?.message || 'Failed to update item quantity');
      throw err;
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setError(null);
      await cartService.removeItem(productId);
      
      // Update cart state
      setCart(prevCart => {
        if (!prevCart) return prevCart;
        
        const updatedItems = prevCart.items.filter(item => item.product.id !== productId);
        return { ...prevCart, items: updatedItems };
      });
    } catch (err: any) {
      console.error('Failed to remove item from cart:', err);
      setError(err?.response?.data?.message || 'Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCart(prevCart => prevCart ? { ...prevCart, items: [] } : null);
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      setError(err?.response?.data?.message || 'Failed to clear cart');
      throw err;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const getTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    refreshCart,
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