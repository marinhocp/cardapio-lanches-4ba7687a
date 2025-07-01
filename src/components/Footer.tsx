
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface CompanyInfo {
  id: string;
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

const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      setCompanyInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatOpeningHours = (hours: any) => {
    if (!hours) return 'Segunda a Domingo: 18h às 23h';
    
    // Se for um objeto com dias da semana
    if (typeof hours === 'object') {
      const dayOrder = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo', 'feriado'];
      const dayNames: { [key: string]: string } = {
        segunda: 'Segunda',
        terca: 'Terça',
        quarta: 'Quarta',
        quinta: 'Quinta',
        sexta: 'Sexta',
        sabado: 'Sábado',
        domingo: 'Domingo',
        feriado: 'Feriado'
      };
      
      const orderedDays = dayOrder
        .filter(day => hours[day])
        .map(day => `${dayNames[day]}: ${hours[day]}`);
      
      return orderedDays.join('\n');
    }
    
    return hours;
  };

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">Carregando informações...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              {companyInfo?.name || '🍔 Burger House'}
            </h3>
            <p className="text-gray-300 mb-4">
              {companyInfo?.description || 
                'Há mais de 10 anos servindo os melhores hamburgers artesanais da cidade. Ingredientes frescos, qualidade garantida e muito sabor em cada mordida.'}
            </p>
            <p className="text-gray-300">
              <strong>Horário de Funcionamento:</strong><br />
              <span style={{ whiteSpace: 'pre-line' }}>
                {formatOpeningHours(companyInfo?.opening_hours)}
              </span>
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">📍 Localização</h3>
            <p className="text-gray-300 mb-2">
              {companyInfo?.address || 
                'Rua dos Hambúrgueres, 123\nCentro - Cidade/UF\nCEP: 12345-678'}
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Telefone:</strong> {companyInfo?.phone || '(11) 99999-9999'}<br />
              {companyInfo?.email && (
                <>
                  <strong>E-mail:</strong> {companyInfo.email}<br />
                </>
              )}
            </p>
            
            <div className="flex space-x-4">
              {companyInfo?.social_media ? (
                Object.entries(companyInfo.social_media).map(([platform, url]) => (
                  <a 
                    key={platform}
                    href={url as string} 
                    className="text-gray-300 hover:text-white transition-colors capitalize"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {platform}
                  </a>
                ))
              ) : (
                <>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">WhatsApp</a>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 {companyInfo?.name || 'Burger House'}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
