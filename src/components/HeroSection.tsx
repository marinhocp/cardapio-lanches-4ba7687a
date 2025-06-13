
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const HeroSection = () => {
  const { addItem } = useCart();

  const handleAddPromoToCart = () => {
    const promoItem = {
      id: 'promo-x-tudo-combo',
      name: 'Combo X-TUDO + Batata + Refrigerante',
      price: 25.90,
      image: '/placeholder.svg',
      description: 'Promoção especial do dia! Combo completo com X-TUDO, batata frita e refrigerante.'
    };
    
    addItem(promoItem);
  };

  return (
    <section className="pt-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Os Melhores Burgers da Cidade!
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Ingredientes frescos, sabor inigualável e entrega rápida. 
            Experimente nossos hamburgers artesanais feitos com muito carinho.
          </p>
          
          <div className="bg-yellow-400 text-red-600 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-2">🔥 PROMOÇÃO DO DIA</h3>
            <p className="text-lg font-semibold">
              Combo X-TUDO + Batata + Refrigerante
            </p>
            <p className="text-3xl font-bold mb-3">R$ 25,90</p>
            <p className="text-sm mb-4">*Válida apenas hoje!</p>
            
            <button
              onClick={handleAddPromoToCart}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
