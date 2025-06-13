
import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, getTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async () => {
    if (!paymentMethod || !deliveryMethod) {
      alert('Por favor, selecione a forma de pagamento e entrega.');
      return;
    }

    setIsSubmitting(true);

    // Formatar mensagem do pedido
    const orderItems = items.map(item => {
      const quantity = items.filter(i => i.name === item.name && i.observations === item.observations).length;
      const baseText = `• ${quantity} ${item.name}`;
      return item.observations ? `${baseText} (${item.observations})` : baseText;
    });

    // Remover duplicatas
    const uniqueItems = [...new Set(orderItems)];

    const orderMessage = `Você adicionou ao seu pedido o seguinte:
${uniqueItems.join('\n')}

Forma de Entrega: ${deliveryMethod === 'delivery' ? 'Entregar' : 'Retirar na loja'}`;

    console.log('Pedido enviado:', orderMessage);
    
    // Aqui você adicionaria a chamada para o webhook
    // await fetch('URL_DO_WEBHOOK', {
    //   method: 'POST',
    //   body: JSON.stringify({ message: orderMessage }),
    // });

    alert('Pedido enviado com sucesso!');
    clearCart();
    setPaymentMethod('');
    setDeliveryMethod('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Carrinho de Compras</h2>
          <button
            onClick={onClose}
            className="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.observations && (
                      <p className="text-sm text-gray-600 mt-1">Obs: {item.observations}</p>
                    )}
                    <p className="text-red-600 font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">
                Total: R$ {getTotal().toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Forma de Pagamento:</h3>
              <div className="grid grid-cols-3 gap-2">
                {['Dinheiro', 'Pix', 'Cartão'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded border text-sm ${
                      paymentMethod === method 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Forma de Entrega:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'pickup', label: 'Retirar na loja' },
                  { key: 'delivery', label: 'Entregar' }
                ].map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setDeliveryMethod(method.key)}
                    className={`p-2 rounded border text-sm ${
                      deliveryMethod === method.key 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !paymentMethod || !deliveryMethod}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Enviando Pedido...' : 'Enviar Pedido'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
