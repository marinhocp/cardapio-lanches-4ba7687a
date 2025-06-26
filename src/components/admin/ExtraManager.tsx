
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';

interface Extra {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  display_order: number;
  created_at: string;
}

const ExtraManager = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExtras();
  }, []);

  const fetchExtras = async () => {
    try {
      const { data, error } = await supabase
        .from('extras')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setExtras(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar extras",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('extras')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            active: formData.active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Extra atualizado",
          description: "O extra foi atualizado com sucesso!",
        });
      } else {
        const { data: maxOrderData } = await supabase
          .from('extras')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);

        const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

        const { error } = await supabase
          .from('extras')
          .insert({
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            active: formData.active,
            display_order: nextOrder,
          });

        if (error) throw error;
        
        toast({
          title: "Extra criado",
          description: "O extra foi criado com sucesso!",
        });
      }

      setFormData({ name: '', description: '', price: '', active: true });
      setEditingId(null);
      setShowAddForm(false);
      fetchExtras();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar extra",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (extra: Extra) => {
    setFormData({
      name: extra.name,
      description: extra.description || '',
      price: extra.price.toString(),
      active: extra.active
    });
    setEditingId(extra.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este extra?')) return;

    try {
      const { error } = await supabase
        .from('extras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Extra excluído",
        description: "O extra foi excluído com sucesso!",
      });
      
      fetchExtras();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir extra",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveExtra = async (extraId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = extras.findIndex(extra => extra.id === extraId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === extras.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const currentExtra = extras[currentIndex];
      const swapExtra = extras[swapIndex];

      const { error: error1 } = await supabase
        .from('extras')
        .update({ display_order: swapExtra.display_order })
        .eq('id', currentExtra.id);

      const { error: error2 } = await supabase
        .from('extras')
        .update({ display_order: currentExtra.display_order })
        .eq('id', swapExtra.id);

      if (error1 || error2) {
        throw error1 || error2;
      }

      toast({
        title: "Ordem atualizada",
        description: "A ordem dos extras foi atualizada com sucesso!",
      });

      fetchExtras();
    } catch (error: any) {
      toast({
        title: "Erro ao reordenar extra",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', active: true });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando extras...</div>;
  }

  const isFormDisabled = Boolean(editingId) || showAddForm;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Extras</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700"
          disabled={isFormDisabled}
        >
          <Plus size={16} className="mr-2" />
          Novo Extra
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Extra' : 'Novo Extra'}
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
                  placeholder="Nome do extra"
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
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do extra"
                  className="resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Extra ativo</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={!formData.name.trim() || !formData.price}
              >
                <Save size={16} className="mr-2" />
                Salvar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Extras Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {extras.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum extra cadastrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extras.map((extra, index) => (
                  <TableRow key={extra.id}>
                    <TableCell className="font-medium">{extra.name}</TableCell>
                    <TableCell>R$ {extra.price.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        extra.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {extra.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => moveExtra(extra.id, 'up')}
                          size="sm"
                          variant="outline"
                          disabled={index === 0 || isFormDisabled}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          onClick={() => moveExtra(extra.id, 'down')}
                          size="sm"
                          variant="outline"
                          disabled={index === extras.length - 1 || isFormDisabled}
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(extra)}
                          size="sm"
                          variant="outline"
                          disabled={editingId === extra.id || showAddForm}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(extra.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          disabled={Boolean(editingId) || showAddForm}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtraManager;
