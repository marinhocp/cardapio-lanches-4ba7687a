
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../integrations/supabase/client';
import { getBotFromSession, getClienteFromSession, getInstanciaFromSession } from '../utils/clienteUtils';
import CartHeader from './CartHeader';
import CartContent from './CartContent';
import CartFooter from './CartFooter';
import SuccessModal from './SuccessModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompanyInfo {
  webhook_url: string | null;
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateItem, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [allExtras, setAllExtras] = useState<Extra[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCompanyInfo();
      fetchExtras();
    }
  }, [isOpen]);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('webhook_url')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCompanyInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações da empresa:', error);
    }
  };

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('id, name, price')
        .eq('active', true);

      if (error) throw error;
      setAllExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar extras:', error);
    }
  };

  if (!isOpen) return null;

  const getExtrasPrice = (extraIds: string[]) => {
    return extraIds.reduce((total, id) => {
      const extra = allExtras.find(e => e.id === id);
      return total + (extra ? extra.price : 0);
    }, 0);
  };

  const getItemTotalPrice = (item: any) => {
    const basePrice = item.price;
    const extrasPrice = getExtrasPrice(item.extras || []);
    return basePrice + extrasPrice;
  };

  const getTotalWithExtras = () => {
    return items.reduce((total, item) => total + getItemTotalPrice(item), 0);
  };

  const getExtraNames = (extraIds: string[]) => {
    return extraIds.map(id => {
      const extra = allExtras.find(e => e.id === id);
      return extra ? extra.name : '';
    }).filter(Boolean);
  };

  const handleSubmitOrder = async () => {
    if (!paymentMethod || !deliveryMethod) {
      alert('Por favor, selecione a forma de pagamento e entrega.');
      return;
    }

    if (deliveryMethod === 'delivery' && !address.trim()) {
      alert('Por favor, informe o endereço para entrega.');
      return;
    }

    if (paymentMethod === 'Pix' && !email.trim()) {
      alert('Por favor, informe o email para o Pix.');
      return;
    }

    if (paymentMethod === 'Dinheiro' && changeAmount && parseFloat(changeAmount) < getTotalWithExtras()) {
      alert('O valor do troco deve ser maior ou igual ao total do pedido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bot = getBotFromSession();
      const cliente = getClienteFromSession();
      const instancia = getInstanciaFromSession();
      
      // Estruturar dados do pedido em JSON conforme nova estrutura
      const orderData = {
        itemsMessage: items.map(item => ({
          [item.name]: {
            preço: {
              valor: getItemTotalPrice(item),
              extras: item.extras ? getExtraNames(item.extras) : [],
              observação: item.observations ?? ''
            }
          }
        })),
        paymentMethod: {
          totalAmount: getTotalWithExtras(),
          troco: paymentMethod === 'Dinheiro' && changeAmount ? parseFloat(changeAmount) : null,
          email: paymentMethod === 'Pix' ? email : null
        },
        deliveryMethod: {
          address: deliveryMethod === 'delivery' ? address : null
        },
        bot: bot ?? null,
        cliente: cliente ?? null,
        instancia: instancia ?? null,
        timestamp: new Date().toISOString()
      };

      // Formatar mensagem do pedido para log
      const orderItems = items.map(item => {
        let itemText = `• ${item.name}`;
        
        if (item.extras && item.extras.length > 0) {
          const extraNames = getExtraNames(item.extras);
          if (extraNames.length > 0) {
            itemText += ` (+ ${extraNames.join(', ')})`;
          }
        }
        
        if (item.observations) {
          itemText += ` - Obs: ${item.observations}`;
        }
        
        const itemTotal = getItemTotalPrice(item);
        itemText += ` - R$ ${itemTotal.toFixed(2).replace('.', ',')}`;
        
        return itemText;
      });

      let orderMessage = `🍔 NOVO PEDIDO

${orderItems.join('\n')}

📍 Entrega: ${deliveryMethod === 'delivery' ? 'Entregar' : 'Retirar na loja'}`;

      if (deliveryMethod === 'delivery') {
        orderMessage += `\n📌 Endereço: ${address}`;
      }

      orderMessage += `\n💳 Pagamento: ${paymentMethod}`;

      if (paymentMethod === 'Pix') {
        orderMessage += `\n📧 Email: ${email}`;
      }

      if (paymentMethod === 'Dinheiro' && changeAmount) {
        orderMessage += `\n💰 Troco para: R$ ${parseFloat(changeAmount).toFixed(2).replace('.', ',')}`;
      }

      if (bot) {
        orderMessage += `\n👤 Bot: ${bot}`;
      }

      orderMessage += `\n\n💰 Total: R$ ${getTotalWithExtras().toFixed(2).replace('.', ',')}`;

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

      // Limpar dados do formulário (mas manter parâmetros no sessionStorage)
      clearCart();
      setPaymentMethod('');
      setDeliveryMethod('');
      setAddress('');
      setEmail('');
      setChangeAmount('');
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <CartHeader onClose={onClose} />
          
          <CartContent
            items={items}
            allExtras={allExtras}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />

          {items.length > 0 && (
            <CartFooter
              total={getTotalWithExtras()}
              paymentMethod={paymentMethod}
              deliveryMethod={deliveryMethod}
              address={address}
              email={email}
              changeAmount={changeAmount}
              isSubmitting={isSubmitting}
              onPaymentMethodChange={setPaymentMethod}
              onDeliveryMethodChange={setDeliveryMethod}
              onAddressChange={setAddress}
              onEmailChange={setEmail}
              onChangeAmountChange={setChangeAmount}
              onSubmitOrder={handleSubmitOrder}
            />
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessMessage}
        onClose={handleCloseSuccess}
      />
    </>
  );
};

export default Cart;
