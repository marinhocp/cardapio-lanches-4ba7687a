
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
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  active: boolean;
  valid_until: string | null;
  created_at: string;
}

const PromotionManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    valid_until: '',
    active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar promoções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const promotionData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        image: formData.image || null,
        valid_until: formData.valid_until || null,
        active: formData.active,
        updated_at: new Date().toISOString(),
      };

      if (id) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Promoção atualizada",
          description: "A promoção foi atualizada com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(promotionData);

        if (error) throw error;
        
        toast({
          title: "Promoção criada",
          description: "A promoção foi criada com sucesso!",
        });
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        valid_until: '',
        active: true
      });
      setEditingId(null);
      setShowAddForm(false);
      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar promoção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setFormData({
      name: promotion.name,
      description: promotion.description || '',
      price: promotion.price.toString(),
      image: promotion.image || '',
      valid_until: promotion.valid_until || '',
      active: promotion.active
    });
    setEditingId(promotion.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Promoção excluída",
        description: "A promoção foi excluída com sucesso!",
      });
      
      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir promoção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      valid_until: '',
      active: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando promoções...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Promoções</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700"
          disabled={showAddForm || Boolean(editingId)}
        >
          <Plus size={16} className="mr-2" />
          Nova Promoção
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Promoção' : 'Nova Promoção'}
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
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da promoção"
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
                <Label htmlFor="active">Promoção ativa</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleSave(editingId || undefined)}
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
          <CardTitle>Promoções Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma promoção cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Válida até</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell>R$ {promotion.price.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                      {promotion.valid_until 
                        ? new Date(promotion.valid_until).toLocaleDateString('pt-BR')
                        : 'Sem data limite'
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        promotion.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {promotion.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(promotion)}
                          size="sm"
                          variant="outline"
                          disabled={editingId === promotion.id || showAddForm}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(promotion.id)}
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

export default PromotionManager;
