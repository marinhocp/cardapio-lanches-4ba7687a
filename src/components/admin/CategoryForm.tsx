
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';

interface CategoryFormProps {
  formData: { name: string; description: string };
  setFormData: (data: { name: string; description: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const CategoryForm = ({ formData, setFormData, onSave, onCancel, isEditing }: CategoryFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome da categoria"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da categoria"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700"
            disabled={!formData.name.trim()}
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

export default CategoryForm;
