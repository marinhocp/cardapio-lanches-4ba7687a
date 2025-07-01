
import React from 'react';

interface OrderSummaryProps {
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  total,
  paymentMethod,
  deliveryMethod,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="space-y-4">
      <div className="text-right">
        <p className="text-2xl font-bold text-red-600">
          Total: R$ {total.toFixed(2).replace('.', ',')}
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !paymentMethod || !deliveryMethod}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Enviando Pedido...' : 'Enviar Pedido'}
      </button>
    </div>
  );
};

export default OrderSummary;
