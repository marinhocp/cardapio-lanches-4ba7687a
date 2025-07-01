
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../integrations/supabase/client';
import ExtraSelector from './ExtraSelector';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id?: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [observations, setObservations] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [allExtras, setAllExtras] = useState<Extra[]>([]);
  const [isBeverage, setIsBeverage] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (product) {
      fetchExtras();
      checkIfBeverage();
    }
  }, [product]);

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

  const checkIfBeverage = async () => {
    if (!product?.category_id) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('id', product.category_id)
        .single();

      if (error) throw error;
      
      const categoryName = data?.name?.toLowerCase() || '';
      const isBeverageCategory = categoryName.includes('bebida') || 
                                categoryName.includes('refrigerante') || 
                                categoryName.includes('suco') ||
                                categoryName.includes('drink');
      setIsBeverage(isBeverageCategory);
    } catch (error) {
      console.error('Erro ao verificar categoria:', error);
    }
  };

  if (!product) return null;

  const getExtrasPrice = () => {
    return selectedExtras.reduce((total, id) => {
      const extra = allExtras.find(e => e.id === id);
      return total + (extra ? extra.price : 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return product.price + getExtrasPrice();
  };

  const handleAddToCart = () => {
    addItem({ 
      ...product, 
      observations: isBeverage ? undefined : observations,
      extras: isBeverage ? undefined : selectedExtras 
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
          
          {!isBeverage && (
            <>
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
            </>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-red-600">
              R$ {getTotalPrice().toFixed(2).replace('.', ',')}
              {!isBeverage && getExtrasPrice() > 0 && (
                <span className="text-sm text-gray-600 block">
                  (Base: R$ {product.price.toFixed(2).replace('.', ',')} + Extras: R$ {getExtrasPrice().toFixed(2).replace('.', ',')})
                </span>
              )}
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
