
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanyInfo } from '@/types/company';

interface CompanyBasicInfoProps {
  companyInfo: CompanyInfo | null;
  onUpdateField: (field: keyof CompanyInfo, value: string) => void;
}

const CompanyBasicInfo = ({ companyInfo, onUpdateField }: CompanyBasicInfoProps) => {
  return (
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
              onChange={(e) => onUpdateField('name', e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={companyInfo?.phone || ''}
              onChange={(e) => onUpdateField('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={companyInfo?.email || ''}
              onChange={(e) => onUpdateField('email', e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
          
          <div>
            <Label htmlFor="webhook_url">URL do Webhook</Label>
            <Input
              id="webhook_url"
              value={companyInfo?.webhook_url || ''}
              onChange={(e) => onUpdateField('webhook_url', e.target.value)}
              placeholder="https://example.com/webhook"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={companyInfo?.address || ''}
            onChange={(e) => onUpdateField('address', e.target.value)}
            placeholder="Rua, número - Bairro"
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={companyInfo?.description || ''}
            onChange={(e) => onUpdateField('description', e.target.value)}
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
              onChange={(e) => onUpdateField('logo_url', e.target.value)}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>
          
          <div>
            <Label htmlFor="banner_url">URL do Banner</Label>
            <Input
              id="banner_url"
              value={companyInfo?.banner_url || ''}
              onChange={(e) => onUpdateField('banner_url', e.target.value)}
              placeholder="https://exemplo.com/banner.png"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyBasicInfo;
