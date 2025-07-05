
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useOrderSession } from '../hooks/useOrderSession';
import { supabase } from '../integrations/supabase/client';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  observations?: string;
  extras?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotal: () => number;
  itemCount: number;
  sessionToken: string | null;
  orderId: string | null;
  sessionLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { sessionToken, orderId, loading: sessionLoading } = useOrderSession();

  // Carregar itens do pedido quando orderId estiver disponível
  useEffect(() => {
    if (orderId) {
      loadOrderItems();
    }
  }, [orderId]);

  const loadOrderItems = async () => {
    if (!orderId) return;

    try {
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (name, price, image_url),
          order_item_extras (
            quantity,
            unit_price,
            extras (name)
          )
        `)
        .eq('order_id', orderId);

      if (error) {
        console.error('Erro ao carregar itens do pedido:', error);
        return;
      }

      if (orderItems) {
        const cartItems: CartItem[] = orderItems.map(item => ({
          id: item.id,
          name: item.products?.name || '',
          price: Number(item.unit_price),
          image: item.products?.image_url || '/placeholder.svg',
          observations: item.notes || undefined,
          extras: item.order_item_extras?.map((extra: any) => extra.extras?.name) || []
        }));

        setItems(cartItems);
      }
    } catch (error) {
      console.error('Erro ao buscar itens do pedido:', error);
    }
  };

  const addItem = async (item: CartItem) => {
    if (!orderId) {
      console.error('Order ID não disponível');
      return;
    }

    try {
      // Adicionar item no banco
      const { data: orderItem, error } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: item.id,
          quantity: 1,
          unit_price: item.price,
          notes: item.observations
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar item no banco:', error);
        return;
      }

      // Adicionar extras se existirem
      if (item.extras && item.extras.length > 0) {
        // Buscar IDs dos extras pelo nome
        const { data: extrasData } = await supabase
          .from('extras')
          .select('id, name, price')
          .in('name', item.extras);

        if (extrasData) {
          const extraInserts = extrasData.map(extra => ({
            order_item_id: orderItem.id,
            extra_id: extra.id,
            quantity: 1,
            unit_price: extra.price
          }));

          await supabase
            .from('order_item_extras')
            .insert(extraInserts);
        }
      }

      // Atualizar estado local
      const newItem = {
        ...item,
        id: orderItem.id
      };
      setItems(prev => [...prev, newItem]);

      // Show success toast
      const event = new CustomEvent('show-toast', {
        detail: { message: `${item.name} adicionado ao carrinho!`, type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      // Remover do banco
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover item do banco:', error);
        return;
      }

      // Atualizar estado local
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const updateItem = async (id: string, updates: Partial<CartItem>) => {
    try {
      // Atualizar no banco
      const { error } = await supabase
        .from('order_items')
        .update({
          notes: updates.observations
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar item no banco:', error);
        return;
      }

      // Atualizar estado local
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const clearCart = async () => {
    if (!orderId) return;

    try {
      // Remover todos os itens do banco
      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (error) {
        console.error('Erro ao limpar carrinho no banco:', error);
        return;
      }

      // Limpar estado local
      setItems([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const itemCount = items.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      getTotal,
      itemCount,
      sessionToken,
      orderId,
      sessionLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};
