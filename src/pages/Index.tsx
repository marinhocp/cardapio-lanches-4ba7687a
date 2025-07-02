
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductModal from '../components/ProductModal';
import { CartProvider } from '../contexts/CartContext';
import { getBotFromUrl, storeBotInSession } from '../utils/clienteUtils';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Capturar e armazenar o parâmetro bot da URL
    const bot = getBotFromUrl();
    console.log('URL completa:', window.location.href);
    console.log('Parâmetro bot encontrado:', bot);
    if (bot) {
      storeBotInSession(bot);
      console.log('Bot armazenado no sessionStorage:', bot);
    } else {
      console.log('Nenhum parâmetro bot encontrado na URL');
    }
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <HeroSection />
        <MenuSection onProductClick={setSelectedProduct} />
        <Footer />
        
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </CartProvider>
  );
};

export default Index;
