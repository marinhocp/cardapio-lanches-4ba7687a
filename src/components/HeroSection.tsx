
import React from 'react';

const HeroSection = () => {
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
            <p className="text-3xl font-bold">R$ 25,90</p>
            <p className="text-sm">*Válida apenas hoje!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
