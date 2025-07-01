
import React from 'react';

interface OrderFormProps {
  paymentMethod: string;
  deliveryMethod: string;
  address: string;
  email: string;
  changeAmount: string;
  onPaymentMethodChange: (method: string) => void;
  onDeliveryMethodChange: (method: string) => void;
  onAddressChange: (address: string) => void;
  onEmailChange: (email: string) => void;
  onChangeAmountChange: (amount: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  paymentMethod,
  deliveryMethod,
  address,
  email,
  changeAmount,
  onPaymentMethodChange,
  onDeliveryMethodChange,
  onAddressChange,
  onEmailChange,
  onChangeAmountChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Forma de Pagamento:</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Dinheiro', 'Pix', 'Cartão'].map((method) => (
            <button
              key={method}
              onClick={() => onPaymentMethodChange(method)}
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
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-red-600 focus:outline-none"
            />
          </div>
        )}

        {paymentMethod === 'Dinheiro' && (
          <div className="mt-3">
            <input
              type="number"
              placeholder="Troco para quanto? (Ex: 50.00)"
              value={changeAmount}
              onChange={(e) => onChangeAmountChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-red-600 focus:outline-none"
              step="0.01"
              min="0"
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
              onClick={() => onDeliveryMethodChange(method.key)}
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
              onChange={(e) => onAddressChange(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-red-600 focus:outline-none resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
