'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  cart: CartItem[];
  addToCart: (productId: number, product: any, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (productId: number, product: any, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: Date.now(), // Simple ID generation
          productId,
          quantity,
          product: {
            id: productId,
            title: product.title,
            price: product.price,
            images: product.images,
          },
        };
        return [...prevCart, newItem];
      }
    });

    // Show success message (you could integrate with a toast library)
    alert(`Added ${product.title} to cart!`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
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