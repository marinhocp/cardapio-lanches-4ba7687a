
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductModal from '../components/ProductModal';
import { CartProvider } from '../contexts/CartContext';
import { getBotFromUrl, storeBotInSession, getClienteFromUrl, storeClienteInSession, getInstanciaFromUrl, storeInstanciaInSession, getSessionTokenFromUrl } from '../utils/clienteUtils';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Capturar e armazenar os parâmetros da URL incluindo session_token
    const bot = getBotFromUrl();
    const cliente = getClienteFromUrl();
    const instancia = getInstanciaFromUrl();
    const sessionToken = getSessionTokenFromUrl();
    
    console.log('URL completa:', window.location.href);
    console.log('Parâmetro bot encontrado:', bot);
    console.log('Parâmetro cliente encontrado:', cliente);
    console.log('Parâmetro instancia encontrado:', instancia);
    console.log('Session token encontrado:', sessionToken);
    
    if (bot) {
      storeBotInSession(bot);
      console.log('Bot armazenado no sessionStorage:', bot);
    }
    
    if (cliente) {
      storeClienteInSession(cliente);
      console.log('Cliente armazenado no sessionStorage:', cliente);
    }
    
    if (instancia) {
      storeInstanciaInSession(instancia);
      console.log('Instancia armazenado no sessionStorage:', instancia);
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
