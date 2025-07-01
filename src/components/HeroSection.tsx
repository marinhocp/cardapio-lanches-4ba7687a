
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useCart } from '../contexts/CartContext';
import { showToast } from '../utils/toast';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  active: boolean;
  valid_until: string | null;
}

interface CompanyInfo {
  logo_url: string | null;
}

const HeroSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchActivePromotions();
    fetchCompanyInfo();
  }, []);

  const fetchActivePromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('active', true)
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString().split('T')[0]}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar promoções:', error);
        return;
      }

      setPromotions(data || []);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('logo_url')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCompanyInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotionToCart = (promotion: Promotion) => {
    addItem({ 
      id: promotion.id,
      name: promotion.name,
      price: promotion.price,
      image: promotion.image || '/placeholder.svg'
    });
    
    showToast(`${promotion.name} adicionado ao carrinho!`, 'success');
  };

  const activePromotion = promotions.length > 0 ? promotions[0] : null;

  return (
    <section className="pt-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {companyInfo?.logo_url && (
            <div className="mb-8">
              <img 
                src={companyInfo.logo_url} 
                alt="Logo da empresa"
                className="mx-auto h-24 w-auto object-contain"
              />
            </div>
          )}
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Os Melhores Burgers da Cidade!
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Ingredientes frescos, sabor inigualável e entrega rápida. 
            Experimente nossos hamburgers artesanais feitos com muito carinho.
          </p>
          
          {loading ? (
            <div className="bg-yellow-400 text-red-600 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-lg">Carregando promoções...</p>
            </div>
          ) : activePromotion ? (
            <div className="bg-yellow-400 text-red-600 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2">🔥 PROMOÇÃO DO DIA</h3>
              <p className="text-lg font-semibold">
                {activePromotion.name}
              </p>
              <p className="text-3xl font-bold mb-3">
                R$ {activePromotion.price.toFixed(2).replace('.', ',')}
              </p>
              {activePromotion.description && (
                <p className="text-sm mb-3">{activePromotion.description}</p>
              )}
              {activePromotion.valid_until && (
                <p className="text-sm mb-4">
                  *Válida até {new Date(activePromotion.valid_until).toLocaleDateString('pt-BR')}!
                </p>
              )}
              
              <button
                onClick={() => handleAddPromotionToCart(activePromotion)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors inline-block"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ) : (
            <div className="bg-yellow-400 text-red-600 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2">🍔 HAMBURGERS ARTESANAIS</h3>
              <p className="text-lg">
                Confira nosso cardápio completo com os melhores sabores!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
