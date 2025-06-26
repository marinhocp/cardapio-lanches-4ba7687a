
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Extra {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
}

interface ExtraSelectorProps {
  selectedExtras: string[];
  onExtrasChange: (extras: string[]) => void;
}

const ExtraSelector: React.FC<ExtraSelectorProps> = ({ selectedExtras, onExtrasChange }) => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .eq('active', true)
        .order('display_order');

      if (error) {
        console.error('Erro ao carregar extras:', error);
        return;
      }

      setExtras(data || []);
    } catch (error) {
      console.error('Erro ao buscar extras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExtraToggle = (extraId: string) => {
    const newExtras = selectedExtras.includes(extraId)
      ? selectedExtras.filter(id => id !== extraId)
      : [...selectedExtras, extraId];
    
    onExtrasChange(newExtras);
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Carregando extras...</div>;
  }

  if (extras.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">Extras disponíveis:</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {extras.map((extra) => (
          <div key={extra.id} className="flex items-center space-x-2">
            <Checkbox
              id={extra.id}
              checked={selectedExtras.includes(extra.id)}
              onCheckedChange={() => handleExtraToggle(extra.id)}
            />
            <Label 
              htmlFor={extra.id} 
              className="text-sm cursor-pointer flex-1"
            >
              {extra.name} - R$ {extra.price.toFixed(2).replace('.', ',')}
              {extra.description && (
                <span className="text-gray-500 text-xs block">
                  {extra.description}
                </span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraSelector;
