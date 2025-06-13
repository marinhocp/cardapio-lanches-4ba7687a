
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  observations?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  getTotal: () => number;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() + Math.random().toString() }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      getTotal,
      clearCart,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
