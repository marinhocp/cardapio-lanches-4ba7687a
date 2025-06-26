
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { showToast } from '../utils/toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Layout para desktop (mantém o layout original) */}
      <div className="hidden md:block">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
          <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-red-600">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Layout para mobile (novo layout horizontal) */}
      <div className="md:hidden flex items-center p-4 gap-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-lg font-bold text-red-600">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
