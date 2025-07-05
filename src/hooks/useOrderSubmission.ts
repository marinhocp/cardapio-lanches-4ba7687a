import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { createOrderData, formatOrderMessage, getTotalWithExtras } from '../utils/orderUtils';
import { getBotFromSession } from '../utils/clienteUtils';
import { supabase } from '../integrations/supabase/client';

interface Extra {
  id: string;
  name: string;
  price: number;
}

interface CompanyInfo {
  webhook_url: string | null;
}

export const useOrderSubmission = (companyInfo: CompanyInfo | null, allExtras: Extra[]) => {
  const { items, clearCart, sessionToken, orderId } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateOrder = (
    paymentMethod: string,
    deliveryMethod: string,
    address: string,
    email: string,
    changeAmount: string
  ) => {
    if (!paymentMethod || !deliveryMethod) {
      alert('Por favor, selecione a forma de pagamento e entrega.');
      return false;
    }

    if (deliveryMethod === 'delivery' && !address.trim()) {
      alert('Por favor, informe o endereço para entrega.');
      return false;
    }

    if (paymentMethod === 'Pix' && !email.trim()) {
      alert('Por favor, informe o email para o Pix.');
      return false;
    }

    if (paymentMethod === 'Dinheiro' && changeAmount && parseFloat(changeAmount) < getTotalWithExtras(items, allExtras)) {
      alert('O valor do troco deve ser maior ou igual ao total do pedido.');
      return false;
    }

    return true;
  };

  const submitOrder = async (
    paymentMethod: string,
    deliveryMethod: string,
    address: string,
    email: string,
    changeAmount: string
  ) => {
    if (!validateOrder(paymentMethod, deliveryMethod, address, email, changeAmount)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const bot = getBotFromSession();
      
      // Atualizar status do pedido para 'confirmed'
      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            payment_method: paymentMethod,
            delivery_address: deliveryMethod === 'delivery' ? address : null,
            total_price: getTotalWithExtras(items, allExtras)
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Erro ao atualizar status do pedido:', updateError);
        }
      }
      
      // Estruturar dados do pedido em JSON conforme nova estrutura
      const orderData = createOrderData(
        items,
        allExtras,
        paymentMethod,
        deliveryMethod,
        address,
        email,
        changeAmount,
        sessionToken // Adicionar session_token
      );

      // Formatar mensagem do pedido para log
      const orderMessage = formatOrderMessage(
        items,
        allExtras,
        paymentMethod,
        deliveryMethod,
        address,
        email,
        changeAmount,
        bot
      );

      console.log('Pedido estruturado:', orderData);
      console.log('Pedido formatado:', orderMessage);

      // Enviar para webhook se configurado
      if (companyInfo?.webhook_url) {
        try {
          const response = await fetch(companyInfo.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
          
          console.log('Webhook enviado para:', companyInfo.webhook_url);
          console.log('Status da resposta:', response.status);
        } catch (error) {
          console.error('Erro ao enviar webhook:', error);
        }
      } else {
        console.log('Nenhuma URL de webhook configurada');
      }

      // Limpar carrinho após sucesso
      clearCart();
      return true;
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting
  };
};