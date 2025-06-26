
import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../integrations/supabase/client';
import ExtraSelector from './ExtraSelector';

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
  const { items, removeItem, updateItem, getTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editObservations, setEditObservations] = useState('');
  const [editExtras, setEditExtras] = useState<string[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [allExtras, setAllExtras] = useState<Extra[]>([]);

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

  const startEdit = (item: any) => {
    setEditingItem(item.id);
    setEditObservations(item.observations || '');
    setEditExtras(item.extras || []);
  };

  const saveEdit = () => {
    if (editingItem) {
      updateItem(editingItem, {
        observations: editObservations,
        extras: editExtras
      });
      setEditingItem(null);
      setEditObservations('');
      setEditExtras([]);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditObservations('');
    setEditExtras([]);
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

    setIsSubmitting(true);

    try {
      // Formatar mensagem do pedido
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

      orderMessage += `\n\n💰 Total: R$ ${getTotal().toFixed(2).replace('.', ',')}`;

      console.log('Pedido enviado:', orderMessage);

      // Enviar para webhook se configurado
      if (companyInfo?.webhook_url) {
        try {
          await fetch(companyInfo.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify({
              message: orderMessage,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error('Erro ao enviar webhook:', error);
        }
      }

      alert('Pedido enviado com sucesso!');
      clearCart();
      setPaymentMethod('');
      setDeliveryMethod('');
      setAddress('');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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
                <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                  {editingItem === item.id ? (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      
                      <ExtraSelector
                        selectedExtras={editExtras}
                        onExtrasChange={setEditExtras}
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observações
                        </label>
                        <textarea
                          value={editObservations}
                          onChange={(e) => setEditObservations(e.target.value)}
                          placeholder="Observações..."
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-sm text-blue-600 mt-1">
                            Extras: {getExtraNames(item.extras).join(', ')}
                          </p>
                        )}
                        
                        {item.observations && (
                          <p className="text-sm text-gray-600 mt-1">Obs: {item.observations}</p>
                        )}
                        
                        <p className="text-red-600 font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
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
              
              {paymentMethod === 'Pix' && (
                <div className="mt-3">
                  <input
                    type="email"
                    placeholder="Digite seu email para o Pix"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-red-600 focus:outline-none"
                  />
                </div>
              )}
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
              
              {deliveryMethod === 'delivery' && (
                <div className="mt-3">
                  <textarea
                    placeholder="Digite seu endereço completo para entrega"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-red-600 focus:outline-none resize-none"
                  />
                </div>
              )}
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
