
import React from 'react';
import { ShoppingCart, Menu, User, LogIn, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  const { user, isAdmin, signOut, loading } = useAuth();

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

  console.log('Header render - User:', !!user, 'IsAdmin:', isAdmin, 'Loading:', loading);

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
        
        <div className="flex items-center gap-2">
          {/* Authentication and Admin buttons */}
          {user && !loading ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-yellow-400 text-red-600 border-yellow-400 hover:bg-yellow-500 flex items-center gap-1"
                  >
                    <Settings size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="bg-white text-red-600 border-white hover:bg-gray-100 flex items-center gap-1"
              >
                <User size={16} />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : !loading ? (
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-red-600 border-white hover:bg-gray-100 flex items-center gap-1"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            </Link>
          ) : (
            <div className="text-white text-sm">Carregando...</div>
          )}
          
          {/* Cart button */}
          <button
            onClick={onCartClick}
            className="relative bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Carrinho</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
