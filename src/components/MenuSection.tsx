
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category_id: string | null;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  products?: Product[];
}

interface MenuSectionProps {
  onProductClick: (product: any) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onProductClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, []);

  const fetchCategoriesWithProducts = async () => {
    try {
      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Erro ao carregar categorias:', categoriesError);
        return;
      }

      // Buscar produtos ativos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');

      if (productsError) {
        console.error('Erro ao carregar produtos:', productsError);
        return;
      }

      // Agrupar produtos por categoria
      const categoriesWithProducts = categoriesData?.map(category => ({
        ...category,
        products: productsData?.filter(product => product.category_id === category.id) || []
      })) || [];

      // Filtrar apenas categorias que têm produtos
      const categoriesWithActiveProducts = categoriesWithProducts.filter(
        category => category.products && category.products.length > 0
      );

      setCategories(categoriesWithActiveProducts);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-gray-600">Carregando cardápio...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Cardápio</h2>
            <p className="text-lg text-gray-600">Nenhum produto disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.products?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    price: Number(product.price),
                    image: product.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
                  }}
                  onClick={() => onProductClick({
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    price: Number(product.price),
                    image: product.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
                  })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
