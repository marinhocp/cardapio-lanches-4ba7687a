
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyInfo } from '@/types/company';

interface CompanyOpeningHoursProps {
  companyInfo: CompanyInfo | null;
  onUpdateOpeningHours: (day: string, hours: string) => void;
}

const CompanyOpeningHours = ({ companyInfo, onUpdateOpeningHours }: CompanyOpeningHoursProps) => {
  const days = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
    { key: 'feriado', label: 'Feriado' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horário de Funcionamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((day) => (
            <div key={day.key}>
              <Label htmlFor={day.key}>{day.label}</Label>
              <Input
                id={day.key}
                value={companyInfo?.opening_hours?.[day.key] || ''}
                onChange={(e) => onUpdateOpeningHours(day.key, e.target.value)}
                placeholder="18h às 23h"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyOpeningHours;
