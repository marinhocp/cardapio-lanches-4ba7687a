
import React from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

const menuCategories = [
  { title: "Lanches Tradicionais", id: "lanches-tradicionais" },
  { title: "Smash e Gourmet", id: "smash-gourmet" },
  { title: "Frango e Especiais", id: "frango-especiais" },
  { title: "Bebidas", id: "bebidas" }
];

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { itemCount } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // altura aproximada do header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-red-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          🍔 Burger House
        </h1>
        
        {/* Menu de categorias - visível apenas no desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToSection(category.id)}
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
            >
              {category.title}
            </button>
          ))}
        </nav>
        
        <button
          onClick={onCartClick}
          className="relative bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline">Ir para o Carrinho</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
