
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';

interface PromotionFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  valid_until: string;
  active: boolean;
}

interface PromotionFormProps {
  formData: PromotionFormData;
  isEditing: boolean;
  onFormDataChange: (data: PromotionFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  formData,
  isEditing,
  onFormDataChange,
  onSave,
  onCancel,
  isVisible
}) => {
  if (!isVisible) return null;

  const handleFieldChange = (field: keyof PromotionFormData, value: string | boolean) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Promoção' : 'Nova Promoção'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Nome da promoção"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valid_until">Válida até</Label>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until}
              onChange={(e) => handleFieldChange('valid_until', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Descrição da promoção"
              className="resize-none"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleFieldChange('active', checked)}
            />
            <Label htmlFor="active">Promoção ativa</Label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700"
            disabled={!formData.name.trim() || !formData.price}
          >
            <Save size={16} className="mr-2" />
            Salvar
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
          >
            <X size={16} className="mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;
