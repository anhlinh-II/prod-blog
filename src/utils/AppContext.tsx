'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  toggleCart: () => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isCartVisible: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo giỏ hàng từ localStorage chỉ lần đầu khi client-side
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng từ localStorage:', error);
      }
    }
  }, [isInitialized]);

  // Lưu giỏ hàng vào localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    if(cart.length >= 5 ) return;
    
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p);
      }
      return [...prev, { ...item, quantity: item.quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const toggleCart = () => {
    setIsCartVisible(prev => !prev);
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, toggleCart, updateCartItemQuantity, clearCart, isCartVisible }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};