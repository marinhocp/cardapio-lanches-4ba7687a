
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ExtraSelector from './ExtraSelector';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [observations, setObservations] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({ 
      ...product, 
      observations,
      extras: selectedExtras 
    });
    setObservations('');
    setSelectedExtras([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
          
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </div>
        
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
          
          <div className="mb-6">
            <ExtraSelector
              selectedExtras={selectedExtras}
              onExtrasChange={setSelectedExtras}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: sem cebola, sem milho, ponto da carne, etc..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-red-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
