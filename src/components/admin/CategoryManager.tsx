
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';
import CategoryTable from './CategoryTable';

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar categorias",
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
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso!",
        });
      } else {
        // Create new category - get the next display_order
        const { data: maxOrderData } = await supabase
          .from('categories')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);

        const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1;

        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description || null,
            display_order: nextOrder,
          });

        if (error) throw error;
        
        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso!",
        });
      }

      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowAddForm(false);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar categoria",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso!",
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = categories.findIndex(cat => cat.id === categoryId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === categories.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const currentCategory = categories[currentIndex];
      const swapCategory = categories[swapIndex];

      // Swap display_order values
      const { error: error1 } = await supabase
        .from('categories')
        .update({ display_order: swapCategory.display_order })
        .eq('id', currentCategory.id);

      const { error: error2 } = await supabase
        .from('categories')
        .update({ display_order: currentCategory.display_order })
        .eq('id', swapCategory.id);

      if (error1 || error2) {
        throw error1 || error2;
      }

      toast({
        title: "Ordem atualizada",
        description: "A ordem das categorias foi atualizada com sucesso!",
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro ao reordenar categoria",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando categorias...</div>;
  }

  const isFormDisabled = Boolean(editingId) || showAddForm;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-red-600 hover:bg-red-700"
          disabled={isFormDisabled}
        >
          <Plus size={16} className="mr-2" />
          Nova Categoria
        </Button>
      </div>

      {(showAddForm || editingId) && (
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={Boolean(editingId)}
        />
      )}

      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMoveCategory={moveCategory}
        disabled={isFormDisabled}
      />
    </div>
  );
};

export default CategoryManager;
