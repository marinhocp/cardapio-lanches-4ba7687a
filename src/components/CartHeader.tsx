
import React from 'react';
import { X } from 'lucide-react';

interface CartHeaderProps {
  onClose: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-2xl font-bold text-gray-800">Carrinho de Compras</h2>
      <button
        onClick={onClose}
        className="bg-gray-100 rounded-full p-2 hover:bg-gray-200"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartHeader;
