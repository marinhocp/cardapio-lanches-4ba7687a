
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Building } from 'lucide-react';
import { CompanyInfo } from '@/types/company';
import CompanyBasicInfo from './CompanyBasicInfo';
import CompanyOpeningHours from './CompanyOpeningHours';
import CompanySocialMedia from './CompanySocialMedia';

const CompanyInfoManager = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCompanyInfo(data || null);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar informações da empresa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyInfo) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_info')
        .upsert({
          ...companyInfo,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Informações salvas",
        description: "As informações da empresa foram atualizadas com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanyInfo, value: string) => {
    if (!companyInfo) return;
    setCompanyInfo({ ...companyInfo, [field]: value });
  };

  const updateOpeningHours = (day: string, hours: string) => {
    if (!companyInfo) return;
    const currentHours = companyInfo.opening_hours || {};
    setCompanyInfo({
      ...companyInfo,
      opening_hours: { ...currentHours, [day]: hours }
    });
  };

  const updateSocialMedia = (platform: string, url: string) => {
    if (!companyInfo) return;
    const currentSocial = companyInfo.social_media || {};
    setCompanyInfo({
      ...companyInfo,
      social_media: { ...currentSocial, [platform]: url }
    });
  };

  if (loading) {
    return <div className="text-center py-8">Carregando informações da empresa...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building size={24} />
          Informações da Empresa
        </h2>
      </div>

      <CompanyBasicInfo 
        companyInfo={companyInfo}
        onUpdateField={updateField}
      />

      <CompanyOpeningHours 
        companyInfo={companyInfo}
        onUpdateOpeningHours={updateOpeningHours}
      />

      <CompanySocialMedia 
        companyInfo={companyInfo}
        onUpdateSocialMedia={updateSocialMedia}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default CompanyInfoManager;
