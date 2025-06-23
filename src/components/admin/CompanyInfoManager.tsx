
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Building } from 'lucide-react';

interface CompanyInfo {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  opening_hours: any;
  social_media: any;
}

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

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={companyInfo?.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={companyInfo?.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo?.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={companyInfo?.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Rua, número - Bairro"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={companyInfo?.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descrição da empresa"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo_url">URL do Logo</Label>
              <Input
                id="logo_url"
                value={companyInfo?.logo_url || ''}
                onChange={(e) => updateField('logo_url', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
            
            <div>
              <Label htmlFor="banner_url">URL do Banner</Label>
              <Input
                id="banner_url"
                value={companyInfo?.banner_url || ''}
                onChange={(e) => updateField('banner_url', e.target.value)}
                placeholder="https://exemplo.com/banner.png"
              />
            </div>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInfoManager;
