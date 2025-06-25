
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, User, LogIn, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface HeaderProps {
  onCartClick: () => void;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface CompanyInfo {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  banner_url?: string;
  opening_hours?: any;
  social_media?: any;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { itemCount } = useCart();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: '🍔 Burger House' });

  useEffect(() => {
    fetchActiveCategories();
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar informações da empresa:', error);
        return;
      }

      // Use company info from database or default
      if (data) {
        setCompanyInfo(data);
      }
    } catch (error) {
      console.error('Erro ao buscar informações da empresa:', error);
    }
  };

  const fetchActiveCategories = async () => {
    try {
      // Buscar categorias que têm produtos ativos, ordenadas por display_order
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          display_order,
          products!inner (
            id
          )
        `)
        .eq('products.active', true)
        .order('display_order');

      if (categoriesError) {
        console.error('Erro ao carregar categorias:', categoriesError);
        return;
      }

      // Remover duplicatas (quando uma categoria tem múltiplos produtos)
      const uniqueCategories = categoriesData?.reduce((acc: Category[], current) => {
        const exists = acc.find(cat => cat.id === current.id);
        if (!exists) {
          acc.push({
            id: current.id,
            name: current.name,
            display_order: current.display_order
          });
        }
        return acc;
      }, []) || [];

      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

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
          {companyInfo.name}
        </h1>
        
        {/* Menu de categorias - visível apenas no desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToSection(category.id)}
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
            >
              {category.name}
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
