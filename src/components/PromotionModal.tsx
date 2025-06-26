
import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { showToast } from '../utils/toast';
import ExtraSelector from './ExtraSelector';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  valid_until: string | null;
}

interface PromotionModalProps {
  promotion: Promotion | null;
  onClose: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ promotion, onClose }) => {
  const [observations, setObservations] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const { addItem } = useCart();

  if (!promotion) return null;

  const handleAddToCart = () => {
    addItem({ 
      id: promotion.id,
      name: promotion.name,
      price: promotion.price,
      image: promotion.image || '/placeholder.svg',
      observations,
      extras: selectedExtras 
    });
    
    showToast(`${promotion.name} adicionado ao carrinho!`, 'success');
    setObservations('');
    setSelectedExtras([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="p-6 text-center">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full inline-block mb-4">
            <span className="font-bold text-lg">🔥 PROMOÇÃO ESPECIAL!</span>
          </div>
          
          {promotion.image && (
            <img 
              src={promotion.image} 
              alt={promotion.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <h2 className="text-4xl font-bold mb-4 text-red-800">{promotion.name}</h2>
          
          {promotion.description && (
            <p className="text-xl text-red-700 mb-6">{promotion.description}</p>
          )}
          
          <div className="text-5xl font-bold text-red-800 mb-6">
            R$ {promotion.price.toFixed(2).replace('.', ',')}
          </div>
          
          {promotion.valid_until && (
            <p className="text-red-700 mb-6 font-semibold">
              ⏰ Válida até {new Date(promotion.valid_until).toLocaleDateString('pt-BR')}!
            </p>
          )}
        </div>

        <div className="bg-white rounded-t-3xl p-6">
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
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-bold text-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart size={24} />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
