
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyInfo } from '@/types/company';

interface CompanySocialMediaProps {
  companyInfo: CompanyInfo | null;
  onUpdateSocialMedia: (platform: string, url: string) => void;
}

const CompanySocialMedia = ({ companyInfo, onUpdateSocialMedia }: CompanySocialMediaProps) => {
  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'twitter', label: 'Twitter' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map((social) => (
            <div key={social.key}>
              <Label htmlFor={social.key}>{social.label}</Label>
              <Input
                id={social.key}
                value={companyInfo?.social_media?.[social.key] || ''}
                onChange={(e) => onUpdateSocialMedia(social.key, e.target.value)}
                placeholder={`URL do ${social.label}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySocialMedia;
