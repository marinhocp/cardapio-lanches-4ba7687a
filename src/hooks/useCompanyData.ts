import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface CompanyInfo {
  webhook_url: string | null;
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

export const useCompanyData = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [allExtras, setAllExtras] = useState<Extra[]>([]);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('webhook_url')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCompanyInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações da empresa:', error);
    }
  };

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('id, name, price')
        .eq('active', true);

      if (error) throw error;
      setAllExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar extras:', error);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
    fetchExtras();
  }, []);

  return {
    companyInfo,
    allExtras
  };
};