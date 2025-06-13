
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">🍔 Burger House</h3>
            <p className="text-gray-300 mb-4">
              Há mais de 10 anos servindo os melhores hamburgers artesanais da cidade. 
              Ingredientes frescos, qualidade garantida e muito sabor em cada mordida.
            </p>
            <p className="text-gray-300">
              <strong>Horário de Funcionamento:</strong><br />
              Segunda a Domingo: 18h às 23h
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">📍 Localização</h3>
            <p className="text-gray-300 mb-2">
              Rua dos Hambúrgueres, 123<br />
              Centro - Cidade/UF<br />
              CEP: 12345-678
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Telefone:</strong> (11) 99999-9999<br />
              <strong>WhatsApp:</strong> (11) 99999-9999
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Burger House. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
