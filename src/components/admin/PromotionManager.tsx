
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import PromotionForm from './PromotionForm';
import PromotionTable from './PromotionTable';

interface Promotion {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  active: boolean;
  valid_until: string | null;
  created_at: string;
}

interface PromotionFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  valid_until: string;
  active: boolean;
}

const PromotionManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<PromotionFormData>({
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

  const handleSave = async () => {
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

      if (editingId) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingId);

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

      resetForm();
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
      image: promotion.image_url || '',
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

  const resetForm = () => {
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

      <PromotionForm
        formData={formData}
        isEditing={Boolean(editingId)}
        onFormDataChange={setFormData}
        onSave={handleSave}
        onCancel={resetForm}
        isVisible={showAddForm || Boolean(editingId)}
      />

      <PromotionTable
        promotions={promotions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        disabled={Boolean(editingId) || showAddForm}
      />
    </div>
  );
};

export default PromotionManager;
