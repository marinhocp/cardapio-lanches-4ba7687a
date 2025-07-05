import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { getSessionTokenFromUrl, getSessionTokenFromLocalStorage, storeSessionTokenInLocalStorage } from '../utils/clienteUtils';

interface Order {
  id: string;
  session_token: string;
  status: string;
  created_at: string;
}

export const useOrderSession = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // 1. Tentar obter session_token da URL
      let token = getSessionTokenFromUrl();
      
      // 2. Se não encontrou na URL, tentar obter do localStorage
      if (!token) {
        token = getSessionTokenFromLocalStorage();
      }

      if (token) {
        // Armazenar no localStorage se veio da URL
        if (getSessionTokenFromUrl()) {
          storeSessionTokenInLocalStorage(token);
        }

        setSessionToken(token);
        
        // Buscar ou criar order baseado no session_token
        const order = await findOrCreateOrder(token);
        if (order) {
          setOrderId(order.id);
        }
      } else {
        // Se não tem session_token, gerar um novo
        const newToken = generateSessionToken();
        setSessionToken(newToken);
        storeSessionTokenInLocalStorage(newToken);
        
        const order = await findOrCreateOrder(newToken);
        if (order) {
          setOrderId(order.id);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSessionToken = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const findOrCreateOrder = async (token: string): Promise<Order | null> => {
    try {
      // Primeiro, tentar encontrar order existente
      const { data: existingOrder, error: searchError } = await supabase
        .from('orders')
        .select('id, session_token, status, created_at')
        .eq('session_token', token)
        .single();

      if (existingOrder && !searchError) {
        console.log('Order existente encontrada:', existingOrder);
        return existingOrder;
      }

      // Se não encontrou, criar nova order
      const { data: newOrder, error: createError } = await supabase
        .from('orders')
        .insert({
          session_token: token,
          status: 'creating',
          customer_id: 1, // Temporário - usando ID fixo
          total_price: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar order:', createError);
        return null;
      }

      console.log('Nova order criada:', newOrder);
      return newOrder;
    } catch (error) {
      console.error('Erro em findOrCreateOrder:', error);
      return null;
    }
  };

  return {
    sessionToken,
    orderId,
    loading,
    findOrCreateOrder
  };
};